const fs = require("fs");
const path = require("path");
const { liveKeys, parseIsbns, json } = require("../lib-stripe-live");

function queue(rec) {
  console.log("flipisbn_submit", JSON.stringify(rec));
  try {
    const dir = "/tmp/flipisbn-queue";
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, "submissions.jsonl"), JSON.stringify(rec) + "\n");
  } catch (_) {}
}

module.exports = async function handler(req, res) {
  const q = req.query || {};
  let sessionId = String(q.session_id || "").trim();
  if (!sessionId && req.url) {
    try { sessionId = new URL(req.url, "http://localhost").searchParams.get("session_id") || ""; } catch (_) {}
    sessionId = String(sessionId).trim();
  }
  if (!sessionId.startsWith("cs_")) {
    json(res, 400, { paid: false, error: "missing_session" });
    return;
  }
  const { live, secret } = liveKeys();
  if (!live) {
    json(res, 503, { paid: false, error: "stripe_not_live" });
    return;
  }
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId), {
    headers: { authorization: "Bearer " + secret }
  });
  const session = await r.json();
  const paid = !!(session && session.payment_status === "paid" && session.metadata && session.metadata.product === "flipisbn");
  if (!paid) {
    json(res, 402, { paid: false, error: "not_paid" });
    return;
  }
  const email = String((session.metadata && session.metadata.email) || session.customer_email || "").slice(0, 200);
  const isbns = parseIsbns((session.metadata && session.metadata.isbns) || "");
  queue({
    at: new Date().toISOString(),
    email,
    isbns,
    paid: true,
    stripe: "paid",
    session: sessionId,
    queue: "manual_fill"
  });
  json(res, 200, { paid: true, email, isbns, queued: true });
};
