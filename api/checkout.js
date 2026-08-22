const { liveKeys, publicOrigin, parseIsbns, json, readBody, stripeForm } = require("../lib-stripe-live");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { error: "POST only" });
    return;
  }
  const { live, secret } = liveKeys();
  if (!live) {
    json(res, 503, { error: "stripe_not_live", detail: "Need sk_live_ and pk_live_ in Vercel env. No test-mode public button." });
    return;
  }
  const body = readBody(req);
  const email = String(body.email || "").trim().slice(0, 200);
  const isbns = parseIsbns(body.isbns);
  if (!email || !isbns.length) {
    json(res, 400, { error: "Need email and at least one ISBN" });
    return;
  }
  const origin = publicOrigin(req);
  if (!origin) {
    json(res, 500, { error: "missing_origin" });
    return;
  }
  const { ok, data } = await stripeForm(secret, "/checkout/sessions", {
    mode: "payment",
    customer_email: email,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": "1500",
    "line_items[0][price_data][product_data][name]": "FlipISBN 25-ISBN report",
    success_url: origin + "/thanks.html?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: origin + "/",
    "metadata[email]": email,
    "metadata[isbns]": isbns.join(","),
    "metadata[product]": "flipisbn"
  });
  if (!ok || !data.url) {
    console.log("flipisbn_checkout_fail", data && data.error);
    json(res, 502, { error: "checkout_failed" });
    return;
  }
  json(res, 200, { url: data.url });
};
