# MurdaWon — Spec Site (Couture House Co.)

Static site: open `index.html` or drag this folder into Netlify (no build step).
Stack: HTML/CSS/JS, GSAP + ScrollTrigger, Lenis (CDN). Demo booking + owner portal run on mock data in the `DB` / `OWNER` objects (swap-later seam: Supabase + Stripe).

## Assets still owed by client
- [ ] Real portfolio photos for "The Work" grid (add tiles where index.html says NEEDS REAL PHOTO). Never use theCut photo #0.
- [ ] Closing time / days off (theCut only lists "Opens at 9:00 AM"; demo assumes 9 AM–7 PM daily)
- [ ] Mobile service area + any travel fee
- [ ] Deposit / no-show / cancellation rules
- [ ] Crown Club tiers and prices ($40 / $80 / $150 are proposals)
- [ ] Spin-the-Pole rewards (proposals)
- [ ] Phone number / email for contact (none listed publicly)
- [ ] Domain (canonical set to murdawon.com as a placeholder)

## Deploy
Push this folder to GitHub, then in Netlify: Add new site > Import from GitHub. No build command; publish directory is the repo root (netlify.toml already sets this).

Logo files for print/social are in /brand.
