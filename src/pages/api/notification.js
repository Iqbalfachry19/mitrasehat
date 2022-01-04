const midtransClient = require("midtrans-client");

export default async (req, res) => {
  if (req.method === "GET") {
    res.status(200).json({ status: "success" });
  }
  const [
    transaction_time,
    transaction_status,
    transaction_id,
    status_code,
    signature_key,
    status_message,
    store,
    settlement_time,
    payment_type,
    payment_code,
    order_id,
    merchant_id,
    gross_amount,
    currency,
    approval_code,
  ] = req.body;
  let apiClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });
  let notificationJson = {
    transaction_time,
    transaction_status,
    transaction_id,
    store,
    status_message,
    status_code,
    signature_key,
    settlement_time,
    payment_type,
    payment_code,
    order_id,
    merchant_id,
    gross_amount,
    currency,
    approval_code,
  };
  apiClient.transaction
    .notification(notificationJson)
    .then((statusResponse) => {
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;
      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
          res.status(200);
        } else if (fraudStatus == "accept") {
          res.status(200);
        }
      } else if (transactionStatus == "settlement") {
        res.status(200);
      } else if (transactionStatus == "deny") {
        res.status(200);
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        res.status(200);
      } else if (transactionStatus == "pending") {
        res.status(200);
      }
    });
};
export const config = {
  api: {
    externalResolver: true,
  },
};
