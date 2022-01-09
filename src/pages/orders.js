import { data } from "autoprefixer";
import axios from "axios";
import moment from "moment";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import { useEffect, useState } from "react";
import db from "../../firebase";
import Header from "../components/Header";
import Order from "../components/Order";

function Orders({ orders }) {
  const [session] = useSession();
  const token = `${process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY}:`;
  const encodedToken = Buffer.from(token).toString("base64");
  const headers = {
    Authorization: "Basic " + encodedToken,
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
    Accept: "application/json",
  };
  const [transactionStatus, setTransactionStatus] = useState(null);
  orders.map(async (order) => {
    await axios
      .get(`https://api.sandbox.midtrans.com/v2/${order.id}/status`, {
        headers,
      })
      .then((res) => {
        setTransactionStatus(res.data.transaction_status);
        console.log(res.data.order_id);
        console.log(res.data.transaction_status);
      })
      .catch((err) => {
        err.message;
      });
  });
  return (
    <div>
      <Head>
        <title>RTD Mitra Sehat | My Orders</title>
      </Head>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>
        {session ? (
          <h2>{orders.length} Orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}
        <div className="mt-5 space-y-4">
          {orders?.map(
            ({
              id,
              amount,
              amountShipping,
              items,
              timestamp,
              images,
              status,
            }) => (
              <Order
                key={id}
                id={id}
                amount={amount}
                amountShipping={amountShipping}
                items={items}
                timestamp={timestamp}
                images={images}
                status={
                  status == transactionStatus ? status : transactionStatus
                }
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      status: order.data().status ? order.data().status : null,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: order.data().status
        ? //find the length of the items array use map function
          order.data().images.map((item) => item.length)
        : (
            await stripe.checkout.sessions.listLineItems(order.id, {
              limit: 100,
            })
          ).data,
    }))
  );

  return {
    props: {
      orders,
    },
  };
}
