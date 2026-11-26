# Culture (formerly MurdaWon) — Barber Site (Couture House Co.)

Static site: open `index.html` or drag this folder into Netlify (no build step).
Stack: HTML/CSS/JS, GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.13 (self-hosted in assets/js, no third-party CDN). Demo booking + owner portal run on mock data in the `DB` / `OWNER` objects (swap-later seam: Supabase + Stripe).

## Assets still owed by client
- [x] Portfolio: 10 real cuts from his theCut profile (assets/work-*.webp). Add more by appending to DB.work in index.html. Never use theCut photo #0.
- [ ] Closing time / days off (theCut only lists "Opens at 9:00 AM"; demo assumes 9 AM–7 PM daily)
- [ ] Mobile service area + any travel fee
- [ ] Deposit / no-show / cancellation rules
- [ ] Crown Club tiers and prices ($40 / $80 / $150 are proposals)
- [ ] Spin-the-Pole rewards (proposals)
- [ ] Phone number / email for contact (none listed publicly)
- [ ] Custom domain (site currently lives at https://culture-barbershop.netlify.app/; update canonical/og:url if a domain is added)

## Deploy
Push this folder to GitHub, then in Netlify: Add new site > Import from GitHub. No build command; publish directory is the repo root (netlify.toml already sets this).

Logo files for print/social are in /brand.

## Brand
Business renamed to Culture (Nov 2026). Logo: assets/logo.webp; masters in /brand (culture-logo-*.png). The old murdawon-logo-* files in /brand are retired.

## Booking texts + call forwarding (Twilio) — LIVE SETUP
Every website booking request texts Culture's line (TextNow, (804) 660-1948). Calls and texts to the Twilio number are forwarded there too.

Code: `netlify/functions/` (book, voice, voice-after, voicemail, sms-in) + `netlify/lib/twilio.mjs`. No npm install needed.

1. Twilio: create account, upgrade, buy a local 804 number. Complete A2P 10DLC registration (Messaging > Regulatory Compliance) for this business — texts won't deliver reliably until approved.
2. Netlify > Site configuration > Environment variables, add:
   - TWILIO_ACCOUNT_SID = AC...
   - TWILIO_AUTH_TOKEN  = (from Twilio console)
   - TWILIO_FROM        = +1804XXXXXXX (the Twilio number)
   - OWNER_PHONE        = +18046601948 (optional; this is the default)
   Then redeploy.
3. Twilio > Phone Numbers > your number:
   - A call comes in: Webhook, POST, https://culture-barbershop.netlify.app/.netlify/functions/voice
   - A message comes in: Webhook, POST, https://culture-barbershop.netlify.app/.netlify/functions/sms-in
4. Test: book on the site -> text arrives at (804) 660-1948. Call the Twilio number -> TextNow rings; let it ring out -> voicemail -> voicemail link texted.

Notes: webhooks verify Twilio's signature (forged requests get 403). Availability shown on the site is still sample times, so bookings are REQUESTS that Culture confirms by text.
