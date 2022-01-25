const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");
import * as admin from "firebase-admin";
import { getSession, useSession } from "next-auth/client";
const serviceAccounts = require("../../../permissions.js").firebase;
const serviceAccount = JSON.parse(JSON.stringify(serviceAccounts));
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();
// Create Snap API instance
export default async (req, res) => {
  if (req.method === "GET") {
    const result = await app
      .firestore()
      .collection("transaction")
      .orderBy("timestamp", "desc")
      .get()
      .catch((err) => {
        console.log(err);
      });
    res.status(200).json(result.docs.map((doc) => doc.data()));
  } else if (req.method === "POST") {
    const { items, email, total } = req.body;
    console.log(items);
    let core = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });
    const transformedItemsImage = items.map((item) => item.image);

    const transformedItems = items.map((item) => ({
      id: item.id,
      price: item.price,
      quantity: 1,
      name: item.title,
      brand: "MitraSehat",
      category: item.category,
      merchant_name: "MitraSehat",
    }));
    let parameter = {
      payment_type: "gopay",
      transaction_details: {
        order_id: uuidv4(),
        gross_amount: total,
      },
      item_details: transformedItems,
      customer_details: {
        email,
      },
      gopay: {
        enable_callback: true, // optional
        callback_url: "https://iqbalfachry.xyz/success", // optional
      },
    };

    core
      .charge(parameter)
      .then((transaction) => {
        console.log("chargeResponse:", transaction);
        app
          .firestore()
          .collection("transaction")
          .doc(parameter.transaction_details.order_id)
          .set({
            email: email,
            transaction_id: transaction.transaction_id,
            qr: transaction.actions[0].url,
            status: transaction.transaction_status,
            order_id: transaction.order_id,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            console.log(
              `SUCCESS: Transaction ${transaction.transaction_order_id} has been created to the DB`
            );
          });

        res.status(200).json({
          redirect: parameter.gopay.callback_url,
          orderId: parameter.transaction_details.order_id,
          amount: parameter.transaction_details.gross_amount,
          images: transformedItemsImage,
          qr: transaction.actions[0].url,
        });
      })
      .catch((err) => {
        res.status(400).send(`Error: ${err.message}`);
      });
  }
};
export const config = {
  api: {
    externalResolver: true,
  },
};
