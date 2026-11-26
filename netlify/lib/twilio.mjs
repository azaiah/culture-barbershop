// Shared Twilio helpers. No npm dependencies: plain fetch + Node crypto.
// Required Netlify env vars (Site settings > Environment variables):
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (the Twilio number, e.g. +18045550100)
//   OWNER_PHONE (where alerts/calls go; Culture's TextNow line +18046601948)
import crypto from "node:crypto";

export const env = (k, d = "") => (process.env[k] || d).trim();
export const OWNER = () => env("OWNER_PHONE", "+18046601948");

export function e164(raw) {
  const d = String(raw || "").replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}
export const pretty = (n) => { const d = String(n).replace(/\D/g, "").slice(-10); return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : n; };

export async function sendSMS(to, body) {
  const sid = env("TWILIO_ACCOUNT_SID"), tok = env("TWILIO_AUTH_TOKEN"), from = env("TWILIO_FROM");
  if (!sid || !tok || !from) throw new Error("Twilio env vars missing");
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(`${sid}:${tok}`).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: to, From: from, Body: body.slice(0, 1500) }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Twilio ${r.status}: ${j.message || "send failed"}`);
  return j.sid;
}

// Verify a webhook really came from Twilio (X-Twilio-Signature).
export async function readTwilio(req) {
  const text = await req.text();
  const params = Object.fromEntries(new URLSearchParams(text));
  const tok = env("TWILIO_AUTH_TOKEN");
  const sig = req.headers.get("x-twilio-signature") || "";
  const url = env("PUBLIC_URL_OVERRIDE") ? env("PUBLIC_URL_OVERRIDE") + new URL(req.url).pathname + new URL(req.url).search : req.url;
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join("");
  const expect = crypto.createHmac("sha1", tok).update(Buffer.from(data, "utf-8")).digest("base64");
  const ok = tok && sig && sig.length === expect.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect));
  return { ok: !!ok, params };
}

export const xml = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
export const twiml = (inner) => new Response(`<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`, { headers: { "Content-Type": "text/xml" } });
