import { getSession } from "next-auth/client";
const midtransClient = require("midtrans-client");
import * as admin from "firebase-admin";
const axios = require("axios");
const serviceAccounts = require("../../../permissions.js");
const serviceAccount = JSON.parse(JSON.stringify(serviceAccounts));
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();
export default async (req, res) => {
  const session = await getSession({ req });

  if (req.method === "GET") {
    res.status(200).json({ status: "success", email: session.user.email });
  } else if (req.method === "POST") {
    console.log(req.body);
    let apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
      clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    });
    let notificationJson = req.body;

    apiClient.transaction
      .notification(notificationJson)
      .then((statusResponse) => {
        console.log(statusResponse);
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse.fraud_status;
        if (transactionStatus == "capture") {
          if (fraudStatus == "challenge") {
          } else if (fraudStatus == "accept") {
          }
        } else if (transactionStatus == "settlement") {
          app
            .firestore()
            .collection("users")
            .get()
            .then((email) => {
              email.forEach((doc) => {
                doc.ref
                  .collection("orders")
                  .doc(orderId)
                  .update({
                    status: "settlement",
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    console.log(
                      `SUCCESS: Order ${orderId} has been updated to the DB`
                    );
                  });
              });
            });

          return res.status(200).send({ status: "success" });
        } else if (transactionStatus == "deny") {
          return res.status(200).send({ status: "success" });
        } else if (transactionStatus == "cancel") {
          app
            .firestore()
            .collection("users")
            .get()
            .then((email) => {
              email.forEach((doc) => {
                doc.ref
                  .collection("orders")
                  .doc(orderId)
                  .update({
                    status: "cancel",
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    console.log(
                      `SUCCESS: Order ${orderId} has been updated to the DB`
                    );
                  });
              });
            });

          return res.status(200).send({ status: "success" });
        } else if (transactionStatus == "expire") {
          app
            .firestore()
            .collection("users")
            .get()
            .then((email) => {
              email.forEach((doc) => {
                doc.ref
                  .collection("orders")
                  .doc(orderId)
                  .update({
                    status: "expire",
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    console.log(
                      `SUCCESS: Order ${orderId} has been updated to the DB`
                    );
                  });
              });
            });

          return res.status(200).send({ status: "success" });
        } else if (transactionStatus == "pending") {
          app
            .firestore()
            .collection("users")
            .get()
            .then((email) => {
              email.forEach((doc) => {
                doc.ref
                  .collection("orders")
                  .doc(orderId)
                  .update({
                    status: "pending",
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                  })
                  .then(() => {
                    console.log(
                      `SUCCESS: Order ${orderId} has been updated to the DB`
                    );
                  });
              });
            });

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
