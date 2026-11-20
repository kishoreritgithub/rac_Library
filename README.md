# RAC Library

Reusable animation components for React and Next.js. Every component lives in
its own folder with its own CSS Module, reads its colours and timing from one
tokens file, and needs no packages beyond React.

The Next.js app in this repo is the live catalogue: run it to see every
component working.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
```

## Layout

```
src/
  rac/                    the library (copy from here)
    tokens.css            colours, radius, easing, durations
    cx.ts                 class-name helper
    hooks/                useInView, usePrefersReducedMotion
    Reveal/               Reveal.tsx + Reveal.module.css
    Stagger/
    HorizontalScroll/
    Countdown/
    FaqTabs/
    GlowBackground/
    NavDrawer/
    StatCounter/
    Button/
    Marquee/
    index.ts              re-exports everything
  app/                    demo catalogue (not needed in your projects)
```

## Using it in another project

1. Copy `src/rac` into the project (or only the folders you need, plus
   `tokens.css`, `cx.ts` and `hooks/`).
2. Import the tokens once, for example in `app/layout.tsx`:

   ```tsx
   import "@/rac/tokens.css";
   ```

3. Import components:

   ```tsx
   import { Reveal, Button } from "@/rac";
   ```

Which components depend on what:

| Component | Also needs |
|---|---|
| Reveal, StatCounter | `hooks/useInView.ts`, `cx.ts` |
| Stagger | `Reveal/` |
| Everything else | `cx.ts` only |

## Components

| Component | What it does | Key props |
|---|---|---|
| `Reveal` | Fades and slides content in when it scrolls into view | `direction`, `delay`, `duration`, `distance`, `blur`, `once`, `as` |
| `Stagger` | Reveals each child one after another | `step`, `delay`, `direction` |
| `HorizontalScroll` | Pins a section while vertical scroll moves panels sideways; swipe strip on small screens | `header`, `progress`, `breakpoint`, `top` |
| `Countdown` | Ticking days / hours / minutes / seconds, with an urgent state | `target`, `label`, `doneText`, `urgentBelow`, `onComplete` |
| `FaqTabs` | Accordion with category filter tabs and animated height | `items`, `multiple`, `defaultOpen`, `allLabel` |
| `GlowBackground` | Dark section with slowly drifting colour glows | `colors`, `animated`, `grid`, `as` |
| `NavDrawer` | Top bar with wipe underlines, burger and slide-down mobile menu | `brand`, `links`, `actions`, `sticky`, `dark` |
| `StatCounter` | Number that counts up when it enters the viewport | `value`, `from`, `duration`, `decimals`, `prefix`, `suffix`, `locale`, `label` |
| `Button` | Button or link with sliding arrow and lift-on-hover | `variant`, `size`, `arrow`, `lift`, `href` |
| `Marquee` | Endless ticker in pure CSS | `speed`, `direction`, `pauseOnHover`, `fade`, `gap` |

### Examples

```tsx
<Reveal direction="left" delay={150} blur>
  <h2>Hello</h2>
</Reveal>

<Stagger step={90}>
  <Card /> <Card /> <Card />
</Stagger>

<HorizontalScroll header={<h2>Rounds</h2>}>
  <Panel /> <Panel /> <Panel />
</HorizontalScroll>

<Countdown label="Closes in" target="2027-01-31T23:59:59+05:30" />

<StatCounter value={3000000} prefix="₹" locale="en-IN" label="Prize pool" />

<FaqTabs
  items={[{ question: "Is it free?", answer: "Yes.", category: "General" }]}
  defaultOpen={0}
/>

<Button arrow lift href="/start">Get started</Button>
```

## Theming

All colour, shape and motion values are CSS variables in `src/rac/tokens.css`.
Change them there for a global theme, or override them on a wrapper to theme
one area:

```css
.promo {
  --rac-accent: #e5484d;
  --rac-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
  --rac-dur: 500ms;
}
```

Every component also accepts `className`, so you can extend its styles.

## Accessibility

- All motion respects `prefers-reduced-motion`.
- `FaqTabs` and `NavDrawer` use real buttons with `aria-expanded` and
  `aria-controls`, and closed panels are `inert`.
- `StatCounter` exposes only the final value to screen readers.
- `Marquee` hides its duplicated copy from assistive tech.

## Adding a component

1. Create `src/rac/MyThing/MyThing.tsx` and `MyThing.module.css`.
2. Read values from `--rac-*` tokens, with a fallback: `var(--rac-accent, #5b3df5)`.
3. Add a `prefers-reduced-motion` block.
4. Export it from `src/rac/index.ts` and add a demo section in `src/app/page.tsx`.
