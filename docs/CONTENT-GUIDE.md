# Content guide

Everything you see on the site is rendered from typed data files in `src/data/`. Edit those; you
never need to touch a component. TypeScript will tell you if a required field is missing.

> Dummy values carry a `// TODO: replace with real value` comment. Search the repo for `TODO` to
> find every placeholder.

## The files

| File | Exports | What it drives |
|---|---|---|
| `site.ts` | `site`, `nav`, `sectionMeta`, `sectionOrder`, `externalLinks` | Site name/role, nav labels, each section's eyebrow + title, shared external links |
| `hero.ts` | `hero`, `heroCtas`, `heroFocus`, `about` | Hero copy, CTAs, the "thinking about" ticker, About paragraphs |
| `approach.ts` | `principles` | The "Approach" section — your build principles (icon + title + body) |
| `skills.ts` | `skillCategories` | The Skills matrix cards (bars or tags) |
| `experience.ts` | `experience` | Timeline entries (newest first) |
| `projects.ts` | `projects`, `openSource` | Case-study cards + modal deep-dives, the GitHub strip |
| `achievements.ts` | `stats`, `achievementChips` | Count-up stat blocks + achievement chips |
| `contact.ts` | `contact` | Email, blurb, CTA label, socials, footer line |
| `wakatime.ts` | `wakatime`, `fallbackLanguages` | WakaTime share URL + fallback language mix |
| `types.ts` | (types only) | Shapes for all of the above |

## Common edits

**Change the hero / about copy** → `hero.ts`. The About paragraphs are arrays of text segments so a
segment can be a link (that's how "Oriv" is linked): `{ text: 'Oriv', href: '…', external: true }`.

**Skills** → `skills.ts`. Each category has `display: 'bars' | 'tags'`. Bars use a `level` (0–100)
that only drives bar length — the values are illustrative, so calibrate or switch the category to
`'tags'`. `highlight: true` marks the loudest card. Icons are `lucide-react` components.

**Experience** → `experience.ts`. Entries are newest-first (display order = DOM order). Flags:
`current` (bright node + "Current" chip), `promotedFromPrevious` (renders the "Promoted ↑" connector
to the entry below). Delete the placeholder early-role entry if it doesn't apply.

**Projects** → `projects.ts`. Each project has a `caseStudy` (challenge / approach / architecture /
impact) shown in the modal. `accent` (`cyan|teal|violet|seafoam|nebula`) tints the card. Impact
numbers are dummy — update them. There are intentionally **no code links** (professional/confidential
work). Below the case studies, a secondary strip **auto-loads your public GitHub repos** (with
live-demo links from each repo's "homepage") via the public API — nothing to configure; it falls back
to the profile link (`openSource` in `projects.ts`) if the API is unavailable or rate-limited.

**Stats & achievements** → `achievements.ts`. `stats` count up on scroll; set `value` + optional
`suffix` (e.g. `10` + `'+'`). `real: true` is just a note to you (not rendered differently).

**Contact & socials** → `contact.ts`. Update `email`, the `socials` array (each `id` maps to a brand
icon in `src/components/icons/`), and the `footer` line.

**Nav / section titles** → `site.ts` (`nav`, `sectionMeta`). If you add or rename a section, also
update `sectionOrder` (used by the scroll-spy) and the `SectionId` union in `types.ts`.

## Live languages (WakaTime)

The "Recently coding" tanks in the Skills section pull from WakaTime. To go **live**:

1. In WakaTime, enable **"Display languages publicly"** (profile settings).
2. Open your **Languages** chart → **Embed** → copy the **JSON** URL
   (`https://wakatime.com/share/@rahuljsaliaan/<uuid>.json`).
3. Paste it into `shareUrl` in `src/data/wakatime.ts`.

The badge shows "live · WakaTime" when the fetch succeeds. Until then (or if a browser blocks the
request via CORS), it shows the curated `fallbackLanguages` with a "sample" badge — edit those
placeholder percentages to taste. If CORS blocks the live fetch on your deploy, switch to a
build-time fetch (see docs/ARCHITECTURE.md → Live data).

## Page metadata (SEO / social)

Title, description, Open Graph, and Twitter tags are static in **`index.html`** (an SPA needs them in
the HTML). Keep them in sync with `site.ts`. Before deploying:

1. Replace `og:url` with your real domain.
2. Add `public/og-image.png` (~1200×630) for social link previews.

## Adding a brand/social icon

Brand marks are inline SVGs in `src/components/icons/BrandIcons.tsx` (lucide-react deprecated its
brand icons). Add a component there, map it in `brandIconMap.ts`, add the `BrandId` to `types.ts`,
then reference it from `contact.ts`.
