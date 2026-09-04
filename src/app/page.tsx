import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { DemoModePicker } from "@/features/walkthrough/DemoModePicker";

const outputs = [
  {
    n: "01",
    title: "Borrow or wait",
    desc: "Know whether taking on another payment actually makes sense.",
  },
  {
    n: "02",
    title: "Safe capacity",
    desc: "Separate what a lender may sanction from what you can comfortably carry.",
  },
  {
    n: "03",
    title: "Fair rate",
    desc: "Understand a reasonable rate band and the true cost of borrowing.",
  },
  {
    n: "04",
    title: "EMI ceiling",
    desc: "Set a monthly limit and see the trade-off between tenure and total cost.",
  },
];

export default function HomePage() {
  return (
    <PageContainer className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      {/* ─────────────────────────────────────────
          HERO
      ───────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-6 py-16 shadow-sm sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[24px] border-blue-50" />

        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-slate-50" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            Borrower-first lending assessment
          </div>

          {/* Heading */}
          <h1 className="mt-7 text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
            Know before
            <br />
            <span className="text-blue-600">you borrow.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Borrower Copilot helps you decide whether to borrow, how much you
            can safely carry, what rate is reasonable, and what EMI you should
            agree to.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-blue-600 px-8 text-sm font-semibold shadow-sm hover:bg-blue-700"
            >
              <Link href="/assessment">
                Start assessment
                <span className="ml-2">→</span>
              </Link>
            </Button>

            <span className="text-xs text-slate-500">
              Takes about 2–3 minutes
            </span>
          </div>

          {/* Trust points */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
            <span>No login required</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>No bureau pull</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>Runs in your browser</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          DEMO BORROWERS
      ───────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
              Explore the product
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-[-0.025em] text-slate-950 sm:text-3xl">
              Meet three demo borrowers
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              See how the recommendation changes when income, debt, and
              financial stability look different.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            3 example profiles
          </span>
        </div>

        <DemoModePicker />
      </section>

      {/* ─────────────────────────────────────────
          FOUR OUTPUTS
      ───────────────────────────────────────── */}
      <section className="mt-20 sm:mt-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">
            The assessment
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">
            Four decisions before you talk to a lender
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Instead of starting with a loan amount, start with what is
            financially safe for you.
          </p>
        </div>

        {/* Output cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outputs.map((item, index) => (
            <div
              key={item.n}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                index === 1
                  ? "border-blue-200 bg-blue-50/60"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* Number */}
              <div className="flex items-start justify-between">
                <span
                  className={`text-xs font-bold tracking-wide ${
                    index === 1 ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {item.n}
                </span>

                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-all ${
                    index === 1
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white"
                  }`}
                >
                  →
                </span>
              </div>

              {/* Content */}
              <div className="mt-14">
                <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.desc}
                </p>
              </div>

              {/* Decorative line */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-300 group-hover:w-full ${
                  index === 1 ? "bg-blue-600" : "bg-slate-300"
                }`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────
          BORROWER-FIRST PRINCIPLE
      ───────────────────────────────────────── */}
      <section className="mt-16 sm:mt-20">
        <div className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-10 sm:px-10 sm:py-12">
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-[18px] border-slate-800" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-400">
                Borrower-first principle
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                The goal isn&apos;t to borrow the most.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-400 sm:text-right">
              It&apos;s to borrow an amount you can comfortably repay — even
              when things don&apos;t go exactly to plan.
            </p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}