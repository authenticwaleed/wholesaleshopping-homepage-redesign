# Video walkthrough outline (about 4 minutes)

> **Draft for you to edit.** The brief asks for 3–5 minutes, showing the homepage and explaining the most important decisions: *"focus on why, not just what you built."* Say it in your own words; the lines below are prompts, not a script to read.

**Before recording:**
- Open the live link (or http://localhost:4321) on desktop.
- For the phone view, use your phone, or the browser's device mode (Chrome DevTools → toggle device toolbar → iPhone 12/13).
- Have `docs/images/first-screen-phone.jpg` and `first-screen-desktop.jpg` ready to show.
- Record with Loom or OBS, and keep it under 5 minutes.

| Time | Show | Say (the *why*) |
|---|---|---|
| 0:00–0:20 | The side-by-side desktop image | Who I am and the task. WholesaleShopping sells to boutiques and online sellers, so I adapted Fashion Nova's patterns for trade buyers instead of copying them. |
| 0:20–1:00 | The phone side-by-side, then the live page on a phone | **Above the fold.** The old hero's text is baked into an image and cut off, with no button and no product. Now the headline says who it's for, and the buttons and one-tap chips are on the first screen. Buyers know they're in the right place and can reach stock in one tap. |
| 1:00–1:40 | Hover the desktop mega menu, then open the phone menu | **Navigation and offers.** 12 menu items became 7 clear ones without losing any category. One offer bar replaces five competing messages. |
| 1:40–2:40 | A product card, then Quick Add, add 2 packs, then the bag | **The wholesale flow.** Resellers compare cost per piece, so that leads on every card. Quick Add lets them order many products without leaving the page, and it opens on the best-value pack. The bag shows the store's real £100 minimum and £300 free delivery as a progress bar, so there are no surprises at checkout, and checkout hands over to the real store. |
| 2:40–3:05 | Scroll: trust strip, banners, "How wholesale ordering works", reviews | **Trust.** Real facts where the decision is made: 4.8 on Trustpilot from 1,111 reviews, same-day dispatch by 2pm, free delivery over £300, Klarna. Plus a four-step guide for first-time trade buyers. |
| 3:05–3:45 | `notes/ai-build-log.md`, the terminal running `npm test` (55 passed), the Lighthouse report | **How I used AI.** Claude Code researched the live store, planned, built and tested with me at checkpoints. Pick 1–2 examples of what went wrong: the wrong assumption about pack sizes, or the bottom bar hiding the buttons, which a passing test missed and a comparison image caught. Then say how it was fixed. |
| 3:45–4:05 | `docs/one-more-day.md` | **Next.** Fix the 26 products without a per-piece price, then add analytics and A/B test the changes. |

**Tips:**
- Talk about the buyer: "a boutique owner on her phone between customers…" works better than "I added a component".
- If something goes wrong while recording, just mention it. The brief values honesty about what didn't work.
