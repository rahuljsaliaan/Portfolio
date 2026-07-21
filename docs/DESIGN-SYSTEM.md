# Design system — "Abyssal Neon"

Material Ocean deep-blue base, lit with bioluminescent neon. Neon is **purposeful** — it marks what
matters (skills, achievements, CTAs, active states), it is not sprayed on everything.

## Color tokens

Defined as CSS variables in `src/index.css` under Tailwind v4's `@theme`, which auto-generates
utilities (`bg-*`, `text-*`, `border-*`).

| Token | Hex | Utility | Use |
|---|---|---|---|
| `--color-ocean-abyss` | `#0F111A` | `ocean-abyss` | Page background |
| `--color-ocean-deep` | `#1A1F2E` | `ocean-deep` | Cards / elevated surfaces |
| `--color-ocean-mist` | `#232A3B` | `ocean-mist` | Modal / higher elevation |
| `--color-current-cyan` | `#38F2E5` | `current-cyan` | Primary neon — links, glow cores, CTAs |
| `--color-biolume-teal` | `#00BFA5` | `biolume-teal` | Secondary accent — skill bars, success |
| `--color-jelly-violet` | `#B388FF` | `jelly-violet` | Tertiary accent — depth/contrast, sparingly |
| `--color-foam-white` | `#E6F1FF` | `foam-white` | Primary text |
| `--color-drift-gray` | `#8492A6` | `drift-gray` | Secondary text |

Opacity modifiers work (`text-current-cyan/60`, `border-current-cyan/15`). The site is dark-only
(`color-scheme: dark`).

## Typography

| Role | Family | Token / utility |
|---|---|---|
| Display (hero, section titles) | Space Grotesk | `font-display` |
| Body | Inter | `font-sans` |
| Data / labels / tags | JetBrains Mono | `font-mono` |

Conventions: oversized hero (`clamp(3.5rem, 10vw, 6.5rem)`); eyebrows are mono, uppercase, with wide
letter-spacing (`tracking-[0.3em]`); comfortable 16–18 px body.

## Surfaces & neon

- **Cards** ("materialistic"): `bg-ocean-deep/70`, 1px low-opacity neon border, subtle backdrop blur,
  rounded corners. Interactive cards intensify the border + add a glow shadow on hover. Shared via
  `cardClasses(accent, interactive)` in `src/components/ui/cardClasses.ts`.
- **Glow** = layered `box-shadow` / `drop-shadow` / `text-shadow` in the accent at low opacity,
  intensifying on hover/focus. Reusable utilities: `text-glow-cyan`, `neon-ring`, `animate-cta-pulse`
  (all in `index.css`).
- **Focus** is always visible: a `current-cyan` `:focus-visible` outline, independent of the custom
  cursor.

## Adding a color or utility

Add a `--color-NAME` under `@theme` in `index.css` and the `bg-/text-/border-NAME` utilities appear
automatically. For a reusable glow, add an `@utility` block (see `text-glow-cyan`). Keep new neon
deliberate — prefer reusing `current-cyan` for cores and the teal/violet accents for variety.
