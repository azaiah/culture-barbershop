// Recording finished -> text Culture who called and a link to the voicemail.
import { readTwilio, sendSMS, pretty, OWNER } from "../lib/twilio.mjs";
export default async (req) => {
  const { ok, params } = await readTwilio(req);
  if (!ok) return new Response("forbidden", { status: 403 });
  const secs = params.RecordingDuration || "?";
  try { await sendSMS(OWNER(), `Culture voicemail (${secs}s) from ${pretty(params.From || params.Caller || "unknown")}:\n${params.RecordingUrl}.mp3`); }
  catch (e) { console.error(e); }
  return new Response("ok");
};
