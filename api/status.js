const { liveKeys, json } = require("../lib-stripe-live");

module.exports = async function handler(req, res) {
  const { live } = liveKeys();
  json(res, 200, {
    live,
    amount: 1500,
    currency: "usd",
    env: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"]
  });
};
