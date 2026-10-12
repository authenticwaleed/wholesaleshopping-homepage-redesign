# Requirements: WholesaleShopping.co.uk Homepage Redesign

**Source:** NaskSoft, "AI Web & CRO Builder – Practical Assessment" (Homepage Redesign Challenge), received 12 Oct 2026.

This file restates the brief as checklists. Text in quotes is the brief's own wording. Each **→ §** points to the section of [PLAN.md](PLAN.md) that covers that requirement. Tick items off as they're met.

---

## 1. Overview

| | |
|---|---|
| Company | NaskSoft |
| Website | WholesaleShopping.co.uk, "a UK-based B2B fashion wholesaler, serving boutiques, online sellers, market traders and other fashion retailers" |
| Task | "Redesign the homepage … with a stronger focus on modern e-commerce design, user experience, mobile usability and conversion" |
| Reference | FashionNova.com is the main design and UX inspiration, but "do not simply copy it" |
| Time | 2 days from receiving the brief, so it's due around the evening of 14 Oct 2026 |

---

## 2. Rules

- [ ] **R-1** Build with AI tools (Claude, Codex, ChatGPT, AI website builders, AI-assisted design or development tools) "rather than relying on traditional Shopify development skills". → §2
- [ ] **R-2** "Use AI effectively, understand what it produces, make sensible changes and test the final result." → §8 checkpoints, §10
- [ ] **R-3** Study how Fashion Nova handles "navigation, promotional messaging, banners, product discovery, collections, visual hierarchy, mobile layouts and calls to action". Then "adapt the strongest ideas to suit a B2B fashion wholesale business". → §6
- [ ] **R-4** Images: "existing Wholesale Shopping product and banner images" may be used, and "suitable Fashion Nova imagery" for presentation. → §4
- [ ] **R-5** "Prioritise the parts of the homepage that have the greatest impact rather than trying to build every possible feature." → §8 order, §12 cut list

---

## 3. Homepage must-haves

> "Your homepage should feel like a real e-commerce experience rather than just a visual mock-up. Think about the complete buying journey."

- [ ] **H-1** Clear navigation and product discovery → §6.2, §6.3, §6.4, §6.7
- [ ] **H-2** Strong hero/banner area → §6.5
- [ ] **H-3** New arrivals and key collections → §6.7, §6.8
- [ ] **H-4** Product sections → §6.8
- [ ] **H-5** Promotional areas → §6.1, §6.11, §6.12
- [ ] **H-6** Clear calls to action → §6.5, §6.8, §6.9, §6.10, §6.13
- [ ] **H-7** Trust and credibility → §6.6, §6.14, §6.17
- [ ] **H-8** B2B wholesale messaging → §6.5, §6.8 (per-piece and pack pricing), §6.13
- [ ] **H-9** Desktop and mobile responsiveness → §5, §6.3, §6.18, Phase 3.4
- [ ] **H-10** Visual hierarchy and spacing → §5
- [ ] **H-11** Purposeful animations or interactions where appropriate → §6.19
- [ ] **H-12** A smoother path from homepage to product discovery and purchase → §6.8, §6.9, §6.10 (Quick Add → bag → checkout)

---

## 4. CRO thinking

> "What would make a fashion retailer arriving on this homepage more likely to browse products, find relevant stock and place an order?"
> "Your decisions should have a reason behind them."

- [ ] **C-1** Where the important CTAs appear → §6.5, §6.8, §6.10
- [ ] **C-2** How quickly users can reach collections → §6.2, §6.7
- [ ] **C-3** How promotions are communicated → §6.1, §6.12
- [ ] **C-4** What information should appear above the fold → §6.1 to §6.6
- [ ] **C-5** How the experience changes on mobile → §6.3, §6.5, §6.9, §6.18
- [ ] **C-6** Every decision has a written reason → §7 (Problem → Change → Benefit) and the AI build log

---

## 5. Mobile

> "Your homepage must work well on mobile. Do not simply shrink the desktop version."

- [ ] **M-1** Mobile navigation → §6.3, §6.18
- [ ] **M-2** Banner proportions → §6.5, §6.12
- [ ] **M-3** Text readability → §5 (body text at least 16 px)
- [ ] **M-4** Button sizes → §5 (tap targets at least 44 px)
- [ ] **M-5** Product cards → §6.8
- [ ] **M-6** Spacing → §5, Phase 3.4
- [ ] **M-7** Scrolling behaviour → §6.7, §6.8 (swipe rows that snap), sticky header
- [ ] **M-8** How quickly shoppers can reach products → §6.5 (categories on the first screen), §6.7

---

## 6. Testing

> "Before submitting, test the experience yourself."

- [ ] **T-1** Navigation works → §9 tests 3–4
- [ ] **T-2** Buttons and links work → §9 tests 7–10
- [ ] **T-3** Sections behave correctly → §9 tests 1, 5–6
- [ ] **T-4** Mobile layouts do not break → §9 test 2 and screenshots at 4 sizes
- [ ] **T-5** Product cards are usable → §9 tests 7 and 11
- [ ] **T-6** Text remains readable → Lighthouse accessibility check and a manual check
- [ ] **T-7** Animations do not interfere with usability → §6.19 and a manual check
- [ ] **T-8** The overall journey feels natural → Checkpoint 2 and a manual check on a real phone
- [ ] **T-9** "If something does not work perfectly, explain what happened and how you attempted to solve it." → §10 log, then the Build Notes

---

## 7. Deliverables

- [ ] **D-1 Working homepage:** "a live link or accessible preview", experienced "on both desktop and mobile". → Phase 5
- [ ] **D-2 Video walkthrough, 3–5 minutes:** show the homepage and explain the most important decisions. "Focus on why, not just what you built." → Phase 6.4
- [ ] **D-3 AI Build Notes,** a short document covering: → Phase 6.1
  - [ ] **Tools Used:** which AI tools were used, and what each was used for
  - [ ] **Your Process:** how the brief and the Fashion Nova reference became the final homepage
  - [ ] **Prompts & Iteration:** a few important prompts (not every prompt)
  - [ ] **What Went Wrong?** At least one thing the AI produced that was incorrect, poor or unusable
  - [ ] **How Did You Fix It?** What was changed, tested or asked of the AI differently
  - [ ] **What Did You Learn?** Something learned during the task that wasn't known before
- [ ] **D-4 CRO Decisions:** at least 5 CRO or UX improvements compared with the existing homepage, each written as **Problem → Change → Expected Benefit**. "We care more about the quality of your reasoning than complicated terminology." → §7, Phase 6.2
- [ ] **D-5 Final question,** answered in a few sentences: "If you had one more day to work on the homepage, what would you improve next, and why?" → Phase 6.3, §11

---

## 8. How it's scored

| Criterion | Weight | What the assessors ask | Where we earn it |
|---|---|---|---|
| Design & Visual Quality | 20% | Does the homepage look modern, clean and appropriate for fashion e-commerce? | §5, Checkpoint 1 |
| Mobile Experience | 20% | Does the experience work properly and feel intentionally designed for mobile? | §5, §6.3, §6.18, Phase 3.4 |
| CRO & UX Thinking | 20% | Do your decisions make it easier for wholesale customers to browse and buy? | §7 |
| AI Tool Usage | 20% | Did you use AI effectively to build, investigate problems and improve the result rather than blindly accepting its output? | §10 log, Build Notes |
| Execution & Testing | 10% | Does the homepage actually work, and did you test the important interactions? | §9 |
| Learning & Problem Solving | 10% | Can you explain what went wrong, what you learned and how you improved the result? | §10 log, Build Notes |

---

## 9. What they are not testing

- "We are not looking for the candidate who writes the most code."
- "We are also not expecting a perfect production-ready Shopify theme within two days."
- They want someone who can "take a goal, study a strong reference, use AI intelligently, build something useful, test their work and keep improving it".
- "A simple solution that is well designed, functional, tested and clearly explained can score higher than a technically complicated solution that provides a poor user experience."

---

## 10. Ready to submit when

- [ ] The live link works on desktop and on a real phone
- [ ] Every item in sections 2–6 is ticked, or the notes explain why it isn't
- [ ] The video (3–5 minutes) is recorded
- [ ] The AI Build Notes, the CRO Decisions (at least 5) and the final answer are written
- [ ] Everything is submitted before the evening of 14 Oct 2026
