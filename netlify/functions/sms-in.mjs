// Twilio Messaging webhook (A message comes in -> POST /.netlify/functions/sms-in).
// Relays client texts to Culture's TextNow line. Twilio handles STOP/HELP automatically.
import { readTwilio, sendSMS, pretty, twiml, OWNER } from "../lib/twilio.mjs";
export default async (req) => {
  const { ok, params } = await readTwilio(req);
  if (!ok) return new Response("forbidden", { status: 403 });
  const from = params.From || "";
  if (from.replace(/\D/g, "").endsWith(OWNER().replace(/\D/g, "").slice(-10))) return twiml(""); // ignore loops
  const media = Number(params.NumMedia || 0) ? `\n[${params.NumMedia} photo(s): ${params.MediaUrl0}]` : "";
  try { await sendSMS(OWNER(), `Text from ${pretty(from)}:\n${params.Body || ""}${media}`); } catch (e) { console.error(e); }
  return twiml("");
};
