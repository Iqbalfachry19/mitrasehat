const midtransClient = require("midtrans-client");
const { uuid } = require("uuidv4");
// Create Snap API instance
export default async (req, res) => {
  const { items, email, total } = req.body;
  console.log(items);
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });
  const transformedItems = items.map((item) => ({
    id: item.id,
    price: item.price,
    quantity: 1,
    name: item.title,
    brand: "Midtrans",
    category: "Toys",
    merchant_name: "Midtrans",
  }));
  let parameter = {
    transaction_details: {
      order_id: uuid(),
      gross_amount: total,
    },
    item_details: transformedItems,
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
      res.status(200).json({ token: transactionToken, redirect: redirectUrl });
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
