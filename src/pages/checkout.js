import Header from "../components/Header";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import db from "../../firebase";
import firebase from "firebase";
const stripePromise = loadStripe(process.env.stripe_public_key);
function Checkout() {
  const router = useRouter();
  const [value, setValue] = useState("A");
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const [result, setResult] = useState(null);
  const [session] = useSession();
  const createCheckoutSession = async () => {
    if (value === "A") {
      const checkoutSession = await axios
        .post("/api/midtrans", { items, email: session.user.email, total })
        .catch((error) => {
          console.error(error);
        });
      console.log(checkoutSession);
      // SnapToken acquired from previous step
      snap.pay(checkoutSession?.data.token, {
        // Optional
        onClose: function () {
          /* You may add your own implementation here */
        },
        onSuccess: function (result) {
          console.log("success");
          db.collection("users")
            .doc(session.user.email)
            .collection("orders")
            .doc(checkoutSession.data.orderId)
            .set({
              status: "pending",
              amount: checkoutSession.data.amount,
              amount_shipping: 10000,
              images: checkoutSession.data.images,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          setResult(JSON.stringify(result, null, 2));
        },
        // Optional
        onPending: function (result) {
          console.log("pending");
          db.collection("users")
            .doc(session.user.email)
            .collection("orders")
            .doc(checkoutSession.data.orderId)
            .set({
              status: "pending",
              amount: checkoutSession.data.amount,
              amount_shipping: 10000,
              images: checkoutSession.data.images,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
          setResult(JSON.stringify(result, null, 2));
        },
        // Optional
        onError: function (result) {
          console.log("error");
          db.collection("users")
            .doc(session.user.email)
            .collection("orders")
            .doc(checkoutSession.data.orderId)
            .set({
              status: "pending",
              amount: checkoutSession.data.amount,
              amount_shipping: 10000,
              images: checkoutSession.data.images,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

          setResult(JSON.stringify(result, null, 2));
        },
      });
    }
    if (value === "B") {
      const stripe = await stripePromise;
      const checkoutSession = await axios.post("/api/create-checkout-session", {
        items,
        email: session.user.email,
      });
      const result = await stripe.redirectToCheckout({
        sessionId: checkoutSession.data.id,
      });
      if (result.error) alert(result.error.message);
    }
  };

  return (
    <div className="bg-gray-100">
      <Head>
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="SB-Mid-client-4YeiDBDfHer6ImFz"
        ></script>
        <title>RTD Mitra Sehat | Shopping Basket</title>
      </Head>
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />

          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0 ? "Your Basket is empty." : "Shopping Basket"}
            </h1>
            {items.map((item, i) => (
              <CheckoutProduct
                key={i}
                id={item.id}
                rating={item.rating}
                title={item.title}
                price={item.price}
                description={item.description}
                category={item.category}
                image={item.image}
                hasPrime={item.hasPrime}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                <span className="font-bold">
                  <Currency quantity={total} currency="IDR" />
                </span>
              </h2>
              <select
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              >
                <option value="A">Pay With Midtrans</option>
                <option value="B">Pay With Stripe</option>
              </select>
              <button
                role="link"
                onClick={createCheckoutSession}
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  "from-gray-200 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {!session ? "Sign in to checkout" : "Proceed to checkout"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
