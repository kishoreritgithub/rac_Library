import type { ReactNode } from "react";
import {
  Button,
  FaqTabs,
  GlowBackground,
  HorizontalScroll,
  Marquee,
  NavDrawer,
  Reveal,
  Stagger,
  StatCounter,
  type FaqItem,
} from "@/rac";
import { DemoCountdown } from "./DemoCountdown";
import s from "./page.module.css";

const LINKS = [
  { label: "Reveal", href: "#reveal" },
  { label: "Stats", href: "#stats" },
  { label: "Scroll strip", href: "#strip" },
  { label: "Countdown", href: "#countdown" },
  { label: "FAQ", href: "#faq" },
];

const PANELS = [
  ["Plan", "Sketch the idea and agree on what done looks like."],
  ["Build", "Ship a first working version and put it in front of people."],
  ["Refine", "Fix what testing turned up and tighten the rough edges."],
  ["Launch", "Release it, announce it, and watch how it gets used."],
  ["Learn", "Review the numbers and decide what to build next."],
];

const FAQ: FaqItem[] = [
  {
    category: "Setup",
    question: "How do I add a component to another project?",
    answer: "Copy its folder from src/rac along with tokens.css, cx.ts and the hooks folder, then import it.",
  },
  {
    category: "Setup",
    question: "Does it need any other packages?",
    answer: "No. Each component only needs React and its own CSS Module file.",
  },
  {
    category: "Styling",
    question: "How do I change the colours?",
    answer: "Edit the variables in tokens.css, or override them on any wrapper element to theme one area.",
  },
  {
    category: "Styling",
    question: "Can I change the easing and speed?",
    answer: "Yes. --rac-ease and --rac-dur set the defaults, and most components also take duration props.",
  },
  {
    category: "Accessibility",
    question: "What happens when someone has reduced motion turned on?",
    answer: "Movement is removed and content appears straight away. The pinned strip becomes a normal swipe strip.",
  },
];

function Section({
  id,
  name,
  code,
  children,
  wide,
}: {
  id: string;
  name: string;
  code: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section id={id} className={s.section}>
      <div className={s.wrap}>
        <Reveal>
          <p className={s.eyebrow}>Component</p>
          <h2 className={s.h2}>{name}</h2>
          <pre className={s.code}>
            <code>{code}</code>
          </pre>
        </Reveal>
      </div>
      <div className={wide ? undefined : s.wrap}>{children}</div>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <NavDrawer
        dark
        brand="RAC Library"
        links={LINKS}
        actions={
          <Button size="sm" href="#reveal" arrow>
            Browse
          </Button>
        }
      />

      <GlowBackground grid className={s.hero}>
        <div className={s.wrap}>
          <Reveal blur>
            <p className={s.eyebrow}>GlowBackground + Reveal</p>
          </Reveal>
          <Reveal delay={100} blur>
            <h1 className={s.h1}>Animation components you own.</h1>
          </Reveal>
          <Reveal delay={220}>
            <p className={s.lead}>
              Ten copy-and-paste React components. Each one carries its own CSS, reads from one
              tokens file, and needs no other packages.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className={s.row}>
              <Button size="lg" href="#reveal" arrow>
                See the components
              </Button>
              <Button size="lg" variant="outline" href="#faq">
                How to reuse
              </Button>
            </div>
          </Reveal>
        </div>
      </GlowBackground>

      <div className={s.band}>
        <Marquee speed={28}>
          {["Reveal", "Stagger", "HorizontalScroll", "Countdown", "FaqTabs", "GlowBackground", "NavDrawer", "StatCounter", "Button", "Marquee"].map(
            (n) => (
              <span key={n} className={s.chip}>
                {n}
              </span>
            ),
          )}
        </Marquee>
      </div>

      <Section
        id="reveal"
        name="Reveal and Stagger"
        code={`<Reveal direction="left" delay={150}>…</Reveal>\n<Stagger step={90}>{cards}</Stagger>`}
      >
        <Stagger className={s.grid3} step={110}>
          {["up", "left", "right"].map((d) => (
            <div key={d} className={s.card}>
              <h3>Card</h3>
              <p>Each card fades and slides in a beat after the one before it.</p>
            </div>
          ))}
        </Stagger>
        <div className={s.grid3} style={{ marginTop: 20 }}>
          <Reveal direction="right" className={s.card}>
            <h3>direction=&quot;right&quot;</h3>
            <p>Travels in from the left edge.</p>
          </Reveal>
          <Reveal direction="none" blur className={s.card}>
            <h3>blur</h3>
            <p>Fades in while a blur clears.</p>
          </Reveal>
          <Reveal direction="left" className={s.card}>
            <h3>direction=&quot;left&quot;</h3>
            <p>Travels in from the right edge.</p>
          </Reveal>
        </div>
      </Section>

      <Section
        id="stats"
        name="StatCounter"
        code={`<StatCounter value={3000000} prefix="₹" locale="en-IN" label="Prize pool" />`}
      >
        <div className={s.grid3}>
          <StatCounter value={12500} suffix="+" label="Sign-ups" />
          <StatCounter value={98.6} decimals={1} suffix="%" label="Uptime" />
          <StatCounter value={3000000} prefix="₹" locale="en-IN" label="Indian digit grouping" />
        </div>
      </Section>

      <section id="strip" className={s.stripSection}>
        <HorizontalScroll
          header={
            <div>
              <p className={s.eyebrow}>Component</p>
              <h2 className={s.h2}>HorizontalScroll</h2>
              <p className={s.note}>
                Keep scrolling down. The section pins and the panels move sideways. On phones it
                becomes a swipe strip.
              </p>
            </div>
          }
        >
          {PANELS.map(([title, body], i) => (
            <article key={title} className={s.panel}>
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </HorizontalScroll>
      </section>

      <Section
        id="countdown"
        name="Countdown"
        code={`<Countdown label="Closes in" target="2027-01-31T23:59:59+05:30" />`}
      >
        <div className={s.row}>
          <DemoCountdown label="Closes in" msFromNow={3 * 86_400_000 + 5_000_000} />
          <DemoCountdown label="Urgent style" msFromNow={2 * 3_600_000} />
          <DemoCountdown label="Ends soon" msFromNow={20_000} />
        </div>
      </Section>

      <Section id="buttons" name="Button" code={`<Button arrow lift href="/start">Get started</Button>`}>
        <div className={s.row}>
          <Button arrow>Sliding arrow</Button>
          <Button lift>Lift on hover</Button>
          <Button variant="outline" arrow lift>
            Outline
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section id="faq" name="FaqTabs" code={`<FaqTabs items={items} defaultOpen={0} />`}>
        <FaqTabs items={FAQ} defaultOpen={0} />
      </Section>

      <footer className={s.footer}>
        <div className={s.wrap}>RAC Library. Copy a folder from src/rac and use it anywhere.</div>
      </footer>
    </>
  );
}
