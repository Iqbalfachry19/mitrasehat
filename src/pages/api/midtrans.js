const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require("uuid");
import * as admin from "firebase-admin";

const serviceAccounts = require("../../../permissions.js");
const serviceAccount = JSON.parse(JSON.stringify(serviceAccounts));
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();
// Create Snap API instance
export default async (req, res) => {
  const { items, email, total } = req.body;
  console.log(items);
  let snap = new midtransClient.Snap({
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
    transaction_details: {
      order_id: uuidv4(),
      gross_amount: total,
    },
    item_details: transformedItems,
    customer_details: {
      email,
    },
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: "https://iqbalfachry.xyz/success",
    },
  };

  snap
    .createTransaction(parameter)
    .then((transaction) => {
      let transactionToken = transaction.token;
      let redirectUrl = transaction.redirect_url;
      console.log("transactionToken:", transactionToken);

      res.status(200).json({
        token: transactionToken,
        redirect: redirectUrl,
        orderId: parameter.transaction_details.order_id,
        amount: parameter.transaction_details.gross_amount,
        images: transformedItemsImage,
      });
    })
    .catch((err) => {
      res.status(400).send(`Error: ${err.message}`);
    });

  // alternative way to create transactionToken
  // snap.createTransactionToken(parameter)
  //     .then((transactionToken)=>{
  //         console.log('transactionToken:',transactionToken);
  //     })
};
export const config = {
  api: {
    externalResolver: true,
  },
};
