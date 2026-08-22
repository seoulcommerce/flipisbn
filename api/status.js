const { json } = require("../lib-stripe-live");

module.exports = async function handler(req, res) {
  json(res, 200, {
    live: false,
    amount: 1500,
    currency: "usd",
    killed: true,
    env: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]
  });
};
