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
- [ ] Custom domain (site currently lives at https://murda-won-website.netlify.app/; update canonical/og:url if a domain is added)

## Deploy
Push this folder to GitHub, then in Netlify: Add new site > Import from GitHub. No build command; publish directory is the repo root (netlify.toml already sets this).

Logo files for print/social are in /brand.

## Brand
Business renamed to Culture (Nov 2026). Logo: assets/logo.webp; masters in /brand (culture-logo-*.png). The old murdawon-logo-* files in /brand are retired.
