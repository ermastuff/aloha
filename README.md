# Handoff: Aloha Massage — Poolside Wellness Website

## Overview
A five-page marketing website for **Aloha Massage**, a premium poolside wellness service offered to hotels and resorts. The site is award-winning in ambition: luxurious, elegant, editorial, with a calm tropical mood and heavy use of scroll-driven storytelling and GSAP animation. The five pages are: **Landing (home)**, **About Us**, **Treatments**, **For Hotels**, and **Contact Us**.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing the intended look, motion, and behavior. They are **not production code to copy directly**. They are built as "Design Components" (a streaming HTML+JS prototyping format) and use a small custom runtime (`support.js`) plus inline styles; do not port that runtime.

**Your task:** recreate these designs in the target codebase's environment using its established patterns and libraries. If no codebase exists yet, choose an appropriate stack — a **React + Vite** (or **Next.js**) app with **GSAP + ScrollTrigger** for the scroll animations is the natural fit here, since the entire experience depends on pinned scroll sequences and reveal animations.

## Fidelity
**High-fidelity (hifi).** These are pixel-considered mockups with final colors, typography, spacing, copy, and interaction timing. Recreate the UI faithfully. Exact values are documented below; where a value looks unusual (e.g. `letter-spacing: -0.07em`, `top: 667px`), it is intentional.

---

## Global Design System

### Fonts (Google Fonts)
```
https://fonts.googleapis.com/css2?family=Lancelot&family=Fraunces:opsz,wght@9..144,300;9..144,400&family=Manrope:wght@400;500;700;800&display=swap
```
- **Lancelot** (display/decorative serif) — used ONLY for the giant "Aloha" wordmark in the home hero. `font-weight: 400`.
- **Fraunces** (elegant serif) — all large headings and titles. Almost always `font-weight: 300`. Several headings are set in **italic** (`font-style: italic`) — see per-page notes.
- **Manrope** (sans-serif) — all body copy, eyebrows, menu items, buttons. Weights 400/500/700/800.

### Colors
| Token | Value | Usage |
|---|---|---|
| Teal (brand primary) | `rgb(12, 106, 110)` / `#0C6A6E` | Hero water background, headings on cream, footer background, page outer background |
| Cream / panel | `rgb(217, 217, 217)` / `#D9D9D9` | Main content panel background |
| Off-white text | `#EFE9DD`, `#F2EEE6`, `#F3EFE6` | Text on dark/teal |
| Warm cream (footer text) | `rgb(197, 190, 177)` / `#C5BEB1` | Footer text + buttons |
| Near-black (hero photo base) | `#14110E` | Home hero section background behind photo |
| Menu dot | `#D8C8AC` | Small dots beside menu items |
| Hairlines | `rgba(238,230,217,0.42)` on dark; `rgba(12,106,110,0.22–0.45)` on cream | Thin divider lines |

### Spacing & layout
- **Full-bleed sections.** Every top-level `<section>` is `width: 100%`. Section backgrounds (photos, cream, teal) span the entire viewport edge-to-edge.
- **Centered content.** Inside each section, content is capped and centered: panels use `width: 1344px; max-width: calc(100% - 120px); margin: 0 auto`; footers use `1360px`; the "Perfect For" grid uses `1200px`.
- **Edge inset = 28px.** The hero menu, hairlines, big wordmark and bottom hero elements are inset `28px` from the screen edges. Match this.
- Section vertical rhythm: panels open with large top padding (≈150–300px) for the curved seam; generous 100–172px gaps between blocks.

### Curved panel seam (signature element)
The cream content panel overlaps the hero with a curved top edge:
- `margin-top: -24px` to tuck under the hero.
- `border-top-left-radius: 50% 130px; border-top-right-radius: 50% 130px;` — an elliptical dome.
- **Scroll-reactive:** as the panel scrolls up into view, the dome flattens. JS recomputes the radius height from ~165px (tight dome) down to ~55px (flatter) based on the panel's position relative to the viewport. See `updateCurve()` in any page.

### Buttons
- **`.pill-btn`** (primary, on cream): pill shape, `1px solid rgb(12,106,110)` border, teal text. On hover, a teal fill wipes up from the bottom (`transform: scaleY(0)→1`, `transform-origin: center bottom`, `transition .55s cubic-bezier(0.16,1,0.3,1)`) and text turns cream. Padding ~`13–18px × 26–46px`, `border-radius: 30–40px`, Manrope 700, `letter-spacing` ~0.03–0.12em, uppercase.
- **`.pill-btn-light`** / **`.hero-cta`** / **`.book-btn`**: same mechanic, light/cream variants used on dark/photo backgrounds.
- **`.menu-item`**: nav link; on hover a cream fill wipes up and text turns dark. Includes a 4px `#D8C8AC` dot.
- **`.footer-btn`**: large outlined pill, cream fill wipe on hover.

### Standard easing
`cubic-bezier(0.16, 1, 0.3, 1)` (a strong ease-out) is used almost everywhere for transitions and entrance animations. GSAP scroll tweens use `power3.out` / `power4.out` for reveals and `none` for scrubbed motion.

---

## Shared Hero (all 5 pages)
A full-viewport hero, `height: 100vh` (home: `892px`), background `rgb(12,106,110)`.

- **Animated "water" background.** A `<canvas>` runs a real-time ripple/water simulation in teal (Web Audio-free; pure 2D canvas height-field shader). On home only, the hero uses a **photo** (`hero-massage.png`) with a top/bottom dark gradient instead of the canvas. Treat the water canvas as a "nice to have" — in production it can be a subtle looping shader/video or a static teal; document it but don't block on it.
- **Top menu band** (inset 28px from edges):
  - Two thin hairlines at `top: 30px` and `top: 84px`, split into left and right segments that stop `calc(50% + 86px)` from center (leaving room for the centered logo). They animate in with a left-to-right `wipe-right` (scaleX 0→1), staggered 0.5–0.65s.
  - **Left group:** Treatments · About Us. **Right group:** For Hotels · Contact Us. Items separated by vertical `1px` divider lines (`.vline`) that `grow-down` (scaleY 0→1). Menu items `drop-in` (fade + translateY -14px→0) at ~0.9s.
  - **Centered logo** (`logo.png`), `height: 146px`, `top: 12px`, `filter: brightness(1.32) saturate(0.62)`, fades in at 0.3s.
  - The current page's menu item gets an `.active` style (permanent cream fill).
- Entrance timing is choreographed: lines wipe → logo fades → menu drops → hero text rises.

---

## Pages

### 1. Landing (home) — `Aloha Landing.dc.html`
**Hero** (`height: 892px`, photo background):
- Giant **"Aloha"** wordmark in **Lancelot**, `clamp(140px, 26vw, 320px)`, color `rgba(236,226,206,0.9)`, left-aligned at `left: 28px`, `top: 172px`. It animates by **expanding letter-spacing from 0 to a computed fill value** (JS measures text and stretches it to the container) over 2.1s, `cubic-bezier(0.22,1,0.36,1)`.
- Bottom-left cluster: a vertical line + decorative fan (SVG arcs) + "Luxury massage experiences beside the pool" (`Manrope 36px`, `letter-spacing: -0.07em`) + "Relax. Reconnect. Recharge." tagline. Texts fade in letter-by-letter.
- Bottom hairline spanning edge-to-edge (`left/right: 28px`).
- Bottom-right **"BOOK YOUR EXPERIENCE"** `.book-btn`.

**Section 2 — "Where Relaxation Meets Paradise"** (cream panel, `height: 1700px`, curved seam):
- Centered heading **in italic Fraunces** (`WHERE / RELAXATION / MEETS PARADISE`), `clamp(64px, 7.8vw, 116px)`, `letter-spacing: 0.14em`, teal. Each line rises in (translateY 46px→0, 1s, staggered 0.17s) via IntersectionObserver/scroll.
- Below the heading: a **lotus divider** — left hairline + lotus SVG + right hairline. The hairlines **wipe in (scaleX 0→1)** AFTER the heading finishes, matching the menu line animation. The lotus SVG draws stroke-by-stroke then fills.
- Three treatment teaser cards (`300×395px`, `border-radius: 30px`, photo + dark gradient). On hover the card body expands (`max-height` transition) to reveal copy/links.

**Footer** (teal) — shared, see below.

### 2. About Us — `Aloha About.dc.html`
**Hero** — shared (water canvas), "About Us" active.

**Panel (cream, curved):** centered manifesto.
- Eyebrow "Who we are" (Manrope, uppercase, `letter-spacing: 0.2em`, teal at 60% opacity).
- Heading **in italic Fraunces**: *"Born from island light, and the quiet of water."* `clamp(46px, 5.2vw, 74px)`. Animates as **masked line reveal** (each line sits in an `overflow:hidden` mask and rises up `yPercent 110→0` + fade, `power4.out`, staggered 0.11s, fired once on scroll via GSAP ScrollTrigger `start: 'top 86%'`).
- Storytelling intro paragraph fades + rises (`y 52→0`, once).

**Pinned 3-card story slider** (`.story-stage`, `height: 100vh`, `position: sticky/pinned` via ScrollTrigger):
- Layout: image column (left, `clamp(360px,62vh,620px)` tall, top corners heavily rounded `clamp(160px,26vh,280px)`, bottom corners 14px) + text column (right).
- Mechanic: the section **pins** for `+=3000px` of scroll. The **left images cross-fade** between three sources at the hand-off points; the **right text track scrolls vertically** (`yPercent 0→-66.667`) so each chapter exits up as the next enters from below. Scrubbed (`scrub: 1`).
- 3 chapters: "A poolside, reimagined." → "Calm, comfort, escape." → "Wellness, brought to you." Eyebrow (01/02/03) + Fraunces heading + single paragraph. Last chapter has an **EXPLORE TREATMENTS** `.pill-btn`.

**Full-bleed "hotels" image section** (`.hotels-stage`, `height: 100vh`, pinned):
- Full-bleed photo (`card-hotels.jpg`) with a dark bottom gradient. **No parallax** (image static).
- Pins; on scroll the bottom-left text (eyebrow + Fraunces title + paragraph) and bottom-right **FOR HOTELS** button **rise in from below** (`y 52→0`, staggered). Text left/right edges align with the "Designed to" container below.

**"Designed to" section** (cream): centered masked heading + a 5-row benefits list (01–05), each row reveals on scroll; rows have a subtle hover background.

**Footer** — shared.

### 3. Treatments — `Aloha Treatments.dc.html`
**Hero** — shared, "Treatments" active.
**Menu panel** (cream, curved): a treatments list/menu with hover states on each row (`.treat-row` — name shifts letter-spacing/color on hover). (Refer to the file for the exact treatment names and prices.)
**Footer** — shared.

### 4. For Hotels — `Aloha Hotels.dc.html`
**Hero** — shared (water canvas), "For Hotels" active, storytelling headline *"They came for the sun."* with subtitle and an **INQUIRE NOW** `.hero-cta` (links to Contact).

**Panel (cream, curved):**
- Centered manifesto. Eyebrow "Why hotels choose Aloha" + heading **in italic Fraunces** *"More value. No extra workload."* (`clamp(48px, 5.6vw, 80px)`). Masked-line reveal. Paragraph has extra bottom padding (`60px`).
- **Horizontal photo gallery** (`.gallery-outer` / `.gallery-track`): a row of uniform `400×520px` images, `border-radius: 14px` on all corners, `gap: 22px`. Behavior:
  - **Infinite loop**, duplicated set; wraps seamlessly when offset exceeds one set width.
  - **Idle auto-drift** slowly leftward (`AUTO = -0.35px/frame`).
  - **Scroll-linked:** scrolling down nudges it left, up nudges it right (scroll delta × 0.18, clamped ±22, friction 0.88) — gentle.
  - **Mouse drag** with momentum. No dots, no arrows. Implemented as a `requestAnimationFrame` loop writing `transform: translate3d(x,0,0)`.

**5-reason horizontal slider** (`.reasons-stage`, `height: 100vh`, pinned):
- Mechanic: section **pins** for `+=4000px`; a horizontal track of five `100vw` cards **slides right-to-left** (`x: 0 → -(cardW × 4)`), scrubbed (`scrub: 1.2`). Each card = image left (rounded top) + text right (eyebrow 01–05, Fraunces heading, single paragraph).
- **Text fade-in per card:** as each card approaches center, its eyebrow/heading/paragraph/button fade + rise (`y 28→0`, `power3.out`, small stagger). Timed to be **fully visible exactly when the card is centered** (animation starts ~0.62 of a step early, completes by center).
- 5 reasons: Added value → Guest experience → Luxury atmosphere → Social media appeal → Flexible & effortless. Last card has supporting copy + **INQUIRE NOW** `.pill-btn` (→ Contact).

**"Perfect for" section** (cream): centered masked heading *"Made for places like yours."* + a two-column list of 6 items. Each item is a row with a small dot; a **hairline under each row wipes in (scaleX 0→1) first**, then the text fades + rises — staggered, fired once on scroll. A centered **INQUIRE NOW** `.pill-btn` follows below the grid.

**Footer** — shared.

### 5. Contact Us — `Aloha Contacts.dc.html`
**Hero** — shared, "Contact Us" active.
**Contact panel** (cream, curved): two-column grid (`1fr 1fr`, `gap: 96px`) — contact info / form. (Refer to the file for exact fields and copy.)
**Footer** — shared.

---

## Shared Footer (all pages)
Teal background (`rgb(12,106,110)`), warm-cream text (`rgb(197,190,177)`), content capped at `1360px`:
- Centered logo (`height: 150px`, `filter: brightness(1.45) saturate(0.55)`).
- Two large `.footer-btn` outlined pills side by side: **WHATSAPP** and **CALL US** (Fraunces 64px), each with a small subtitle.
- A hours/phone/address row separated by a top hairline.
- An Instagram block: icon + handle `alohamassage_poolsodewellness` (Fraunces 54px) with an underline-on-hover (`.ig-handle`).
- Copyright line: "ALOHA MASSAGE POOLSIDE WELLNESS | ALL RIGHTS RESERVED 2026".
- Footer elements use a `.reveal-up` (opacity + translateY 36px→0) scroll reveal with small `transition-delay` stagger.

---

## Interactions & Behavior Summary
- **Entrance choreography** in the hero (lines → logo → menu → text), all `cubic-bezier(0.16,1,0.3,1)`.
- **Scroll reveals** (`.reveal-up`, `.s-reveal`, masked headings) fire once when entering the viewport (`top 86–92%`). Use IntersectionObserver or GSAP ScrollTrigger.
- **Pinned scroll sequences** (GSAP ScrollTrigger `pin: true`, `scrub`): About story slider (vertical text track + image crossfade), About hotels image reveal, Hotels reasons slider (horizontal). These define the page length — pinned sections add their `end` distance (`+=3000`/`+=4000`) to scroll height.
- **Curved panel seam** recomputed on scroll (`updateCurve`).
- **Gallery** (Hotels): infinite loop + idle drift + scroll-linked + drag, all via a rAF loop.
- **Hover states**: buttons (fill wipe up), menu items (fill wipe), treatment rows, treatment cards (expand body), Instagram handle (underline).

## State Management
Minimal — this is a marketing site. Per-page transient state only:
- Refs to hero canvas/panel/heading/lotus/gallery elements.
- Animation flags (`_headingDone`, `_storyInit`, slider progress) to avoid re-firing.
- Gallery offset/velocity (`_galleryX`, `_galVel`).
No data fetching except form submission — see **Forms & Email** below.

## Design Tokens (quick reference)
- Colors: `#0C6A6E` (teal), `#D9D9D9` (cream), `#14110E` (hero dark), `#EFE9DD`/`#F2EEE6` (off-white), `#C5BEB1` (footer text), `#D8C8AC` (menu dot).
- Radius: pills `30–40px`; cards `30px` / `14px`; rounded image tops `clamp(160px,26vh,280px)`; panel dome `50% 130px` (animated).
- Type scale: hero wordmark `clamp(140px,26vw,320px)` (Lancelot); display headings `clamp(46–64px, 5.2–7.8vw, 74–116px)` (Fraunces 300, several italic); section headings `clamp(34–58px, …)`; eyebrow 13px/`0.2em`/uppercase (Manrope 600); body 16–20px (Manrope 400); buttons 15–16px/700.
- Easing: `cubic-bezier(0.16,1,0.3,1)` (CSS), `power3.out`/`power4.out` (GSAP reveals), `none` (scrubbed).
- Edge inset: `28px`. Content cap: `1344px` (panels) / `1360px` (footer) / `1200px` (perfect-for grid).

## Assets
All in the `assets/` folder of this bundle:
- `logo.png` — Aloha Massage logo (used in hero + footer, with brightness/saturate filters).
- `hero-massage.png` — home hero photo + reused in galleries/sliders.
- `card-island.jpg`, `card-natural.jpg`, `card-hotels.jpg` — photography for cards, sliders, gallery, and the About hotels image.
These are stand-in photos; swap for the client's final photography. The lotus and decorative fan are inline SVG (in the Landing file) — copy them from there.

## Files (design references in this bundle)
- `Aloha Landing.dc.html` — home
- `Aloha About.dc.html` — about + story slider + hotels image + designed-to
- `Aloha Treatments.dc.html` — treatments menu
- `Aloha Hotels.dc.html` — for hotels + gallery + reasons slider + perfect-for
- `Aloha Contacts.dc.html` — contact
- `assets/` — images and logo

Each `.dc.html` opens directly in a browser to preview the intended result. Inside, markup lives between `<x-dc>…</x-dc>` (inline styles) and the logic class lives in the trailing `<script type="text/x-dc">` block (animation + scroll logic). Read both when recreating a page; the GSAP/scroll logic is the important part to port.

---

## Forms & Email

Both site forms — the **"Book your experience"** modal ([src/pages/Treatments.jsx](src/pages/Treatments.jsx)) and the **contact form** ([src/pages/Contact.jsx](src/pages/Contact.jsx)) — POST JSON to a single Vercel serverless function, [api/contact.js](api/contact.js), which sends **two emails per submission** via [Resend](https://resend.com):

1. **Owner notification** → `OWNER_EMAIL`, with every field (reply-to is set to the visitor's address, so you can reply directly).
2. **Customer confirmation** → the visitor, with a branded recap + thank-you. This is best-effort: if it fails the request still succeeds so the owner is always notified.

### Configuration
Set these environment variables (locally in a `.env` file — copy `.env.example` — and in **Vercel → Settings → Environment Variables** for production):

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key (https://resend.com/api-keys). **Required.** |
| `OWNER_EMAIL` | Where booking/contact notifications are delivered. |
| `FROM_EMAIL` | Verified sender, e.g. `Aloha Massage <no-reply@yourdomain.com>`. Defaults to Resend's shared test sender. |

### Going live (important)
Until a domain is verified in Resend, `FROM_EMAIL` uses the shared test sender `onboarding@resend.dev`, and **Resend only delivers to the email address of your own Resend account** — so customer confirmations to real visitors will not be delivered yet. To enable them: verify your domain in Resend (add the DNS records it shows), then set `FROM_EMAIL` to an address on that domain. No code change needed.

### Local testing
`npm run dev` (Vite) does **not** run the serverless function. To test the emails locally, run the app with the Vercel CLI, which serves `/api` and loads `.env`:

```
npm i -g vercel
vercel dev
```

Otherwise, the endpoint works automatically once deployed to Vercel.
