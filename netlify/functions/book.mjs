// POST /.netlify/functions/book  — website booking request.
// Texts the booking to Culture (OWNER_PHONE) and, if the client opted in, texts the client a receipt.
import { sendSMS, e164, pretty, OWNER } from "../lib/twilio.mjs";

const SERVICES = { bald:"Bald Fade", shadow:"Shadow Fade", taper:"Taper Fade", even:"All Even", gent:"Gentlemen Cut", shape:"Shape Up", dread:"Dread Removal" };
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ ok: false, error: "method" }, 405);
  let b; try { b = await req.json(); } catch { return json({ ok: false, error: "bad json" }, 400); }
  if (b.company) return json({ ok: true }); // honeypot: bots fill hidden field, humans never see it

  const svc = SERVICES[b.svc];
  const name = clean(b.name, 60), phone = e164(b.phone), when = clean(b.when, 80);
  const mode = b.mode === "mobile" ? "mobile" : "studio";
  const addr = clean(b.addr, 140), notes = clean(b.notes, 280), email = clean(b.email, 120);
  const beard = b.beard === true;
  if (!svc || name.length < 2 || !phone || !when || (mode === "mobile" && addr.length < 5)) return json({ ok: false, error: "missing fields" }, 422);
  const ref = "CU-" + Date.now().toString(36).toUpperCase().slice(-6);

  const ownerMsg = [
    `NEW BOOKING REQUEST ${ref}`,
    `${svc}${beard ? " + Beard Enhancement" : ""}`,
    `When: ${when}`,
    mode === "mobile" ? `Mobile: ${addr}` : "Where: Studio",
    `Client: ${name} ${pretty(phone)}`,
    email && `Email: ${email}`,
    notes && `Vision: ${notes}`,
    b.club && "Interested in Crown Club",
    `Text or call ${pretty(phone)} to confirm.`,
  ].filter(Boolean).join("\n");

  try { await sendSMS(OWNER(), ownerMsg); }
  catch (e) { console.error(e); return json({ ok: false, error: "sms" }, 502); }

  if (b.consent === true) {
    const clientMsg = `Culture: got your request for a ${svc} ${when}${mode === "mobile" ? " (mobile)" : ""}. We'll text you shortly to confirm. Ref ${ref}. Reply STOP to opt out.`;
    try { await sendSMS(phone, clientMsg); } catch (e) { console.error("client sms", e.message); }
  }
  return json({ ok: true, ref });
};
