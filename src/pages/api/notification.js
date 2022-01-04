const midtransClient = require("midtrans-client");
const { uuid } = require("uuidv4");
export default async (req, res) => {
  const { items, email, total } = req.body;
  console.log(items);
  let apiClient = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });
  apiClient.transaction
    .notification(notificationJson)
    .then((statusResponse) => {
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;
      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
        } else if (fraudStatus == "accept") {
        }
      } else if (transactionStatus == "settlement") {
      } else if (transactionStatus == "deny") {
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
      } else if (transactionStatus == "pending") {
      }
    });
};
