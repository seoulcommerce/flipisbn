function liveKeys() {
  const secret = process.env.STRIPE_SECRET_KEY || "";
  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
  return {
    live: secret.startsWith("sk_live_") && publishable.startsWith("pk_live_"),
    secret,
    publishable
  };
}

function publicOrigin(req) {
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
  const host = (req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  if (!host) return "";
  return proto + "://" + host;
}

function parseIsbns(raw) {
  const seen = new Set();
  const list = [];
  const text = Array.isArray(raw) ? raw.join("\n") : String(raw || "");
  for (const line of text.split(/[\s,;]+/)) {
    const d = line.replace(/[^0-9Xx]/g, "");
    if (!d) continue;
    if (!/^\d{9}[\dXx]$/.test(d) && !/^\d{13}$/.test(d)) continue;
    const key = d.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    list.push(key);
    if (list.length >= 25) break;
  }
  return list;
}

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  return body || {};
}

async function stripeForm(secret, path, params) {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    body.append(k, String(v));
  }
  const r = await fetch("https://api.stripe.com/v1" + path, {
    method: "POST",
    headers: {
      authorization: "Bearer " + secret,
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  });
  const data = await r.json();
  return { ok: r.ok, status: r.status, data };
}

module.exports = { liveKeys, publicOrigin, parseIsbns, json, readBody, stripeForm };
