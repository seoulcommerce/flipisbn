const { json } = require("../lib-stripe-live");

module.exports = async function handler(req, res) {
  json(res, 503, {
    error: "flipisbn_killed",
    detail: "FlipISBN is not for sale. No charge was made."
  });
};
