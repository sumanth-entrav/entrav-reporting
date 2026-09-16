import { Card } from "@/components/Card";

type Dimension = { icon: string; title: string; items: string[] };

const DIMENSIONS: Dimension[] = [
  { icon: "🏢", title: "Organisation", items: ["Entity / Department / Division", "Cost Centre"] },
  {
    icon: "🗓️",
    title: "Time",
    items: [
      "Years",
      "Quarters",
      "Months",
      "Days",
      "Date Issued",
      "Month of Travel",
      "Travel / Departure Date",
      "Lead Time",
    ],
  },
  {
    icon: "💷",
    title: "Financial",
    items: ["Budget", "Actual", "Forecast", "Total Cost / Amount", "Order Number"],
  },
  { icon: "🧑‍💼", title: "Traveller", items: ["Passenger Details", "Frequent Travellers"] },
  {
    icon: "🤝",
    title: "Agent & Agency",
    items: ["Agent # (code lookup)", "Supplier / Agency Name", "Agency Platform (Amadeus / Sabre / Galileo)"],
  },
  {
    icon: "✈️",
    title: "Travel & Route",
    items: [
      "Carrier Code (SA / BA / MN / JE …)",
      "Source / Segment (AT / LA / SF)",
      "Commission Type (Domestic / Regional / International AT / Accommodation / Car Hire)",
    ],
  },
];

const MEASURES = [
  "Trips",
  "Spend",
  "People",
  "Average cost / person",
  "Average cost / trip",
  "Booking lead times",
  "International vs domestic split",
  "Frequent travellers",
  "Top-N entities, agencies & airlines",
  "Spend above a threshold per entity",
];

const MODEL = [
  {
    icon: "🧾",
    title: "One fact: the travel transaction",
    body: "At the centre sits a single fact — every trip / booking transaction, each carrying a cost / amount and an order number, tagged with the attributes below.",
  },
  {
    icon: "⚖️",
    title: "Financial view: Budget · Actual · Forecast",
    body: "Every measure is reported against three financial lenses so variance to plan is always visible. Some measures are Actual-only where budget or forecast doesn't apply.",
  },
  {
    icon: "🗓️",
    title: "Time view: Years · Quarters · Months · Days",
    body: "Measures roll up and drill down through time granularities, alongside event dates — date issued, month of travel, departure date and booking lead time.",
  },
];

const VIEWS = [
  {
    n: "01",
    title: "Totals Overview",
    body: "Headline totals — trips, spend, people, average cost per person and per trip, frequent travellers, and entities spending above a threshold.",
  },
  {
    n: "02",
    title: "Entity & Agency Analysis",
    body: "Top entities by spend and spend share, top agencies used, agency platforms, and departure trips & lead times.",
  },
  {
    n: "03",
    title: "Spend Categories & Carriers",
    body: "Spend by source / segment and commission type, international vs domestic flight spend, airlines used, and top agencies per entity.",
  },
];

function IconBadge({ children }: { children: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-warn-bg)] text-lg"
    >
      {children}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6 lg:py-14">
      <header className="max-w-3xl">
        <p className="eyebrow">About this dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          The reporting approach
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-text-muted)]">
          This dashboard analyses eNtrav corporate travel spend using a{" "}
          <strong className="text-[var(--color-text)]">dimensional reporting model</strong>. Rather than a
          handful of fixed reports, each measure — spend, trips, travellers, lead time — can be sliced across a
          common set of business dimensions and compared against{" "}
          <strong className="text-[var(--color-text)]">Budget, Actual and Forecast</strong> over time. The
          result is one consistent way to ask questions of the data across every report.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">How the model works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {MODEL.map((m) => (
            <Card key={m.title}>
              <IconBadge>{m.icon}</IconBadge>
              <h3 className="mt-3 text-sm font-semibold text-[var(--color-text)]">{m.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">{m.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Dimensions considered</h2>
        <p className="mt-1 max-w-3xl text-sm text-[var(--color-text-muted)]">
          Every measure can be viewed and filtered along the dimensions below. Together they define the “shape”
          of the data the reports draw on.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIMENSIONS.map((d) => (
            <Card key={d.title} className="flex flex-col">
              <div className="flex items-center gap-3">
                <IconBadge>{d.icon}</IconBadge>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{d.title}</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {d.items.map((item) => (
                  <li key={item} className="pill">
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">What gets measured</h2>
        <p className="mt-1 max-w-3xl text-sm text-[var(--color-text-muted)]">
          The measures below are the numbers reported across those dimensions and the three financial views.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {MEASURES.map((m) => (
            <li
              key={m}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-sm font-medium text-[var(--color-text)]"
            >
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Report views</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {VIEWS.map((v) => (
            <Card key={v.n}>
              <span className="text-2xl font-bold text-[var(--color-accent)]">{v.n}</span>
              <h3 className="mt-2 text-sm font-semibold text-[var(--color-text)]">{v.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">{v.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-[10px] border border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <p className="text-sm text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text)]">Now live.</span> The figures behind this
          approach are on the <strong className="text-[var(--color-text)]">Overview</strong>,{" "}
          <strong className="text-[var(--color-text)]">Revenue &amp; Fees</strong>,{" "}
          <strong className="text-[var(--color-text)]">Suppliers</strong>,{" "}
          <strong className="text-[var(--color-text)]">Cost Centres</strong> and{" "}
          <strong className="text-[var(--color-text)]">Clients</strong> tabs, drawn from the master travel-spend
          extract (Mar 2024 – Jul 2025).
        </p>
      </div>
    </div>
  );
}
