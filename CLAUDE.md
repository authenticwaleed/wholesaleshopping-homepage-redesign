# CLAUDE.md

Homepage redesign concept for WholesaleShopping.co.uk, built for NaskSoft's "AI Web & CRO Builder" assessment. Due around the evening of 14 Oct 2026.

## Source of truth
- `REQUIREMENTS.md`: the brief as checklists, covering what must be delivered and how it's scored. Tick items off as they're met.
- `PLAN.md`: how we build it: stack (§2), section specs (§6), CRO changes (§7), build steps (§8) and tests (§9). Work through §8 in order and tick off each step when it's done.
- If the plan needs to change, ask the user first, then update `PLAN.md` so it stays accurate.

## Working rules
- Stack: Astro, plain JavaScript and plain CSS with design tokens. Don't add React or Tailwind unless the plan changes.
- Mobile-first: tap targets at least 44 px, body text at least 16 px on mobile, WCAG AA contrast, and support for `prefers-reduced-motion`.
- Use only real facts about WholesaleShopping (offers, delivery, reviews). Clearly mark any placeholder and list it in the notes.
- Never place a real order when testing the checkout link.
- Write all page copy in UK English.
- After each notable step, add an entry to `notes/ai-build-log.md`: the prompt, what the AI produced, what was wrong, the fix and what was learned. This log feeds the graded AI Build Notes.

## Commands (once the project is set up)
`npm run dev` · `npm run build` · `npm run preview` · `npm run fetch-data` · `npm test`
