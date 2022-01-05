import { getSession } from "next-auth/client";
const midtransClient = require("midtrans-client");
import * as admin from "firebase-admin";

const serviceAccount = require("../../../permissions.json");
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();
export default async (req, res) => {
  const session = await getSession({ req });
  if (req.method === "GET") {
    console.log(session);
    res.status(200).json({ status: "success" });
  } else if (req.method === "POST") {
    console.log(req.body);
    let apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });
    let notificationJson = req.body;
    await apiClient.transaction
      .notification(notificationJson)
      .then((statusResponse) => {
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        if (transactionStatus == "capture") {
          if (fraudStatus == "challenge") {
          } else if (fraudStatus == "accept") {
          }
        } else if (transactionStatus == "settlement") {
          //  get email from firebase admin auth

          app
            .firestore()
            .collection("users")
            .doc(session.user.email)
            .collection("orders")
            .doc(orderId)
            .update({
              status: "settlement",
            })
            .then(() => {
              console.log(`SUCCESS: Order ${orderId} has been added to the DB`);
            });

          return res.status(200).send({ status: "success" });
        } else if (transactionStatus == "deny") {
          return res.status(200).send({ status: "success" });
        } else if (
          transactionStatus == "cancel" ||
          transactionStatus == "expire"
        ) {
          return res.status(200).send({ status: "success" });
        } else if (transactionStatus == "pending") {
          return res.status(200).send({ status: "success" });
        }
        return res.status(200).send({ status: "success" });
      })
      .catch((err) => {
        console.log("ERROR", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      });
  }
};
export const config = {
  api: {
    externalResolver: true,
  },
};
