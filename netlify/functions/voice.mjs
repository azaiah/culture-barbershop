// Twilio Voice webhook (A call comes in -> POST /.netlify/functions/voice).
// Rings Culture's TextNow line with the caller's own number showing, 25s. No answer -> voicemail.
import { readTwilio, twiml, xml, OWNER } from "../lib/twilio.mjs";
export default async (req) => {
  const { ok } = await readTwilio(req);
  if (!ok) return new Response("forbidden", { status: 403 });
  return twiml(`<Dial timeout="25" answerOnBridge="true" action="/.netlify/functions/voice-after">${xml(OWNER())}</Dial>`);
};
