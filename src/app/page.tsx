import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { DemoModePicker } from "@/features/walkthrough/DemoModePicker";

const outputs = [
  {
    n: "01",
    title: "Should I borrow?",
    desc: "Know whether taking on another payment makes sense for your current financial position.",
  },
  {
    n: "02",
    title: "What can I safely carry?",
    desc: "Separate what a lender may sanction from the amount you can comfortably repay.",
  },
  {
    n: "03",
    title: "Is the rate fair?",
    desc: "Understand a reasonable rate band and the real all-in cost, including fees.",
  },
  {
    n: "04",
    title: "What EMI works?",
    desc: "Set a monthly payment ceiling and understand the tenure trade-off.",
  },
];
export default function HomePage() {
  return (
    <PageContainer className="pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
      {/* Hero */}
    {/* Hero */}
<section className="relative">
  <div className="px-2 py-14 sm:py-18 lg:py-24">
    <div className="mx-auto max-w-4xl text-center">

      {/* Eyebrow */}
      <div className="mb-7 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
        <span
          className="h-1.5 w-1.5 rounded-full bg-blue-600"
          aria-hidden="true"
        />
        Personal lending self-assessment · India
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
        Know what you can
        <br />

        <span className="relative inline-block text-blue-600">
          safely borrow.

          {/* Handwritten underline */}
          <svg
            className="absolute -bottom-3 left-1/2 h-3 w-[105%] -translate-x-1/2"
            viewBox="0 0 300 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 12C55 5 91 16 137 10C181 5 222 13 296 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>

      {/* Description */}
      <p className="mx-auto mt-9 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
        Borrower Copilot helps you make a better borrowing decision before
        you accept a loan — from whether to borrow to the amount, rate, and
        EMI you should be comfortable with.
      </p>

      {/* CTA */}
      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="
            h-12 rounded-xl bg-blue-600 px-7
            text-sm font-semibold text-white
            shadow-sm transition-all
            hover:bg-blue-700
            hover:shadow-md
            active:scale-[0.98]
          "
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

      {/* Trust indicators */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
        <span>No login required</span>

        <span
          className="h-1 w-1 rounded-full bg-slate-300"
          aria-hidden="true"
        />

        <span>No bureau pull</span>

        <span
          className="h-1 w-1 rounded-full bg-slate-300"
          aria-hidden="true"
        />

        <span>Runs in your browser</span>
      </div>

      {/* Handwritten-style supporting note */}
      <div className="mt-10 flex justify-center">
        <p className="rotate-[-2deg] text-sm italic text-slate-400">
          because approved ≠ affordable
        </p>
      </div>
    </div>
  </div>
</section>

{/* What this answers */}
{/* What this answers */}
<section className="mt-24 sm:mt-32">
  {/* Header */}
  <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
    <div>
      <p className="text-[11px] font-semibold tracking-[0.16em] text-blue-600">
        BEFORE YOU BORROW
      </p>

      <h2 className="mt-3 max-w-xl text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-4xl">
        Four decisions that put you in control.
      </h2>
    </div>

    <p className="max-w-md text-sm leading-6 text-slate-500 lg:pb-1">
      A lender can tell you what you qualify for. Borrower Copilot helps you
      decide what you can comfortably afford.
    </p>
  </div>

  {/* Decision framework */}
  <div className="mt-14 border-y border-slate-200">
    <div className="grid lg:grid-cols-4">
      {outputs.map((item, index) => (
        <div
          key={item.n}
          className={`
            relative py-8
            lg:px-7 lg:py-10
            ${
              index !== 0
                ? "border-t border-slate-200 lg:border-l lg:border-t-0"
                : ""
            }
            ${index === 1 ? "bg-blue-50/40" : "bg-white"}
          `}
        >
          {/* Number */}
          <div className="flex items-start justify-between">
            <span
              className={`
                text-4xl font-semibold leading-none tracking-[-0.05em]
                ${
                  index === 1
                    ? "text-blue-600"
                    : "text-slate-200"
                }
              `}
            >
              {item.n}
            </span>

            {index === 1 && (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-blue-700">
                CORE
              </span>
            )}
          </div>

          {/* Content */}
          <div className="mt-10">
            <h3 className="max-w-[180px] text-lg font-semibold leading-6 tracking-[-0.025em] text-slate-950">
              {item.title}
            </h3>

            <p className="mt-3 max-w-[220px] text-sm leading-6 text-slate-500">
              {item.desc}
            </p>
          </div>

          {/* Small bottom marker */}
          <div
            className={`
              mt-8 h-1 w-8 rounded-full
              ${
                index === 1
                  ? "bg-blue-600"
                  : "bg-slate-200"
              }
            `}
          />
        </div>
      ))}
    </div>
  </div>

  {/* Supporting statement */}
  <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs font-medium text-slate-400">
      From eligibility to affordability
    </p>

    <p className="text-xs text-slate-400">
      Built for borrowers, not lenders.
    </p>
  </div>
</section>
      {/* Demo borrowers */}
      <section className="mt-16 sm:mt-20">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-600">
              TRY THE ASSESSMENT
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
              See how the decision changes
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Explore the assessment using three different borrower profiles.
              The recommendation changes with income, existing debt, and
              financial stability.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-400">
            3 example borrowers
          </span>
        </div>

        <DemoModePicker />
      </section>

      {/* Core distinction */}
      <section className="mt-16 sm:mt-20">
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-2">
          <div className="border-b border-slate-200 p-7 md:border-b-0 md:border-r sm:p-9">
            <p className="text-xs font-semibold tracking-wide text-slate-400">
              WHAT A LENDER MAY OFFER
            </p>

            <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
              Likely lender sanction
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              An estimate of how much you might qualify for based on income,
              obligations, credit profile, and other available information.
            </p>
          </div>

          <div className="bg-blue-50/50 p-7 sm:p-9">
            <p className="text-xs font-semibold tracking-wide text-blue-600">
              WHAT YOU SHOULD AIM FOR
            </p>

            <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
              Safe borrowing capacity
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              A more conservative amount designed around what you can repay
              while leaving room for normal expenses and financial shocks.
            </p>

            <div className="mt-5 inline-flex items-center rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700">
              Your recommended number
            </div>
          </div>
        </div>
      </section>

      {/* Borrower-first principle */}
      <section className="mt-16 sm:mt-20">
        <div className="rounded-2xl bg-slate-950 px-6 py-9 sm:px-10 sm:py-11">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold tracking-wide text-blue-400">
                BORROWER-FIRST PRINCIPLE
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                The goal isn't to borrow the most.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-slate-400 sm:text-right">
              It's to choose an amount and EMI you can comfortably repay — even
              when your income or expenses don't go exactly to plan.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-8">
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-start">
          <span className="shrink-0 text-xs font-semibold text-slate-700">
            Important
          </span>

          <p className="text-xs leading-5 text-slate-500">
            Borrower Copilot provides an educational estimate, not a loan
            approval or lender offer. Results depend on the information you
            provide and may differ from a lender's actual assessment.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}