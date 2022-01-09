import { data } from "autoprefixer";
import axios from "axios";
import moment from "moment";
import { getSession, useSession } from "next-auth/client";
import Head from "next/head";
import { useEffect, useState } from "react";
import db from "../../firebase";
import Header from "../components/Header";
import Order from "../components/Order";

function Orders({ orders, orders1, orders2 }) {
  const [session] = useSession();

  const midtrans = orders1.map((order) => {
    return {
      date: new Date(
        order.settlement_time ? order.settlement_time : order.transaction_time
      ),
      status: order.transaction_status,
    };
  });

  const midtrans1 = orders2.map((order) => {
    return {
      date: new Date(order.date),
      status: order.status,
    };
  });
  midtrans.push.apply(midtrans, midtrans1);

  midtrans.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  console.log(midtrans);
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
            (
              { id, amount, amountShipping, items, timestamp, images, status },
              index
            ) => {
              const status1 = midtrans[index];

              return (
                <Order
                  key={id}
                  id={id}
                  amount={amount}
                  amountShipping={amountShipping}
                  items={items}
                  timestamp={timestamp}
                  images={images}
                  status={status == status1 ? status : status}
                />
              );
            }
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context) {
  const midtransClient = require("midtrans-client");
  let apiClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });

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
      date: order.data().timestamp.toDate().toDateString(),
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
  const substring = "cs";

  const midTransOrders = orders.filter(({ id }) => {
    return !id.includes(substring);
  });
  const midTransOrders1 = orders.filter(({ id }) => {
    return id.includes(substring);
  });
  const orders1 = await Promise.all(
    midTransOrders.map(async (order) => {
      return await apiClient.transaction
        .status(order.id)

        .catch((err) => console);
    })
  );

  const orders2 = await Promise.all(
    midTransOrders1.map(async (order) => ({
      id: order.id,
      date: order.date,
      status: order.status,
    }))
  );
  console.log(orders2);
  return {
    props: {
      orders,
      orders1,
      orders2,
    },
  };
}
