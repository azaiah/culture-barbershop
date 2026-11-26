// After the forwarded call ends. If nobody answered, record a voicemail.
import { readTwilio, twiml } from "../lib/twilio.mjs";
export default async (req) => {
  const { ok, params } = await readTwilio(req);
  if (!ok) return new Response("forbidden", { status: 403 });
  if (params.DialCallStatus === "completed") return twiml("<Hangup/>");
  return twiml(`<Say voice="Polly.Matthew">You've reached Culture. We're with a client right now. Leave your name, what you're looking to book, and the best time, and we'll get right back to you. You can also book any time at the website.</Say><Record maxLength="120" playBeep="true" trim="trim-silence" recordingStatusCallback="/.netlify/functions/voicemail" recordingStatusCallbackEvent="completed"/><Say voice="Polly.Matthew">Thanks. Talk soon.</Say>`);
};
