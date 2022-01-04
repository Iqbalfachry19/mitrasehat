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
    await apiClient.transaction
      .notification(notificationJson)
      .then((statusResponse) => {
        let orderId = statusResponse.order_id;
        let transactionStatus = statusResponse.transaction_status;

        if (transactionStatus == "settlement") {
          return res.status(200);
        } else if (transactionStatus == "deny") {
          return res.status(200);
        } else if (
          transactionStatus == "cancel" ||
          transactionStatus == "expire"
        ) {
          return res.status(200);
        } else if (transactionStatus == "pending") {
          return res.status(200);
        }
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
