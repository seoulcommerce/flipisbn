module.exports = async function handler(req, res) {
  console.log("flipisbn_hit", new Date().toISOString(), req.headers["x-forwarded-for"] || "");
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ ok: true }));
};
