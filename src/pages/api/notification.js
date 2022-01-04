const midtransClient = require("midtrans-client");

export default async (req, res) => {
  if (req.method === "GET") {
    res.status(200).json({ status: "success" });
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
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;
        let fraudStatus = statusResponse?.fraud_status;
        console.log(
          `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
        );

        if (transactionStatus == "capture") {
          if (fraudStatus == "challenge") {
            res.status(200).json({ status: "ok" });
          } else if (fraudStatus == "accept") {
            res.status(200).json({ status: "ok" });
          }
        } else if (transactionStatus == "settlement") {
          res.status(200).json({ status: "ok" });
        } else if (transactionStatus == "deny") {
          res.status(200).json({ status: "ok" });
        } else if (
          transactionStatus == "cancel" ||
          transactionStatus == "expire"
        ) {
          res.status(200).json({ status: "ok" });
        } else if (transactionStatus == "pending") {
          res.status(200).json({ status: "ok" });
        }
        res.status(200).json({ status: "ok" });
      });
  }
};
export const config = {
  api: {
    externalResolver: true,
  },
};
