const fs = require("fs");
const path = require("path");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("POST only");
    return;
  }
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email = String((body && body.email) || "").slice(0, 200);
  const isbns = Array.isArray(body && body.isbns) ? body.isbns.slice(0, 25) : [];
  const rec = {
    at: new Date().toISOString(),
    email,
    isbns,
    paid: false,
    stripe: "blocked",
    queue: "manual_fill"
  };
  console.log("flipisbn_submit", JSON.stringify(rec));
  try {
    const dir = "/tmp/flipisbn-queue";
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, "submissions.jsonl"), JSON.stringify(rec) + "\n");
  } catch (_) {}
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ ok: true, queued: true, paid: false, stripe: "blocked" }));
};
