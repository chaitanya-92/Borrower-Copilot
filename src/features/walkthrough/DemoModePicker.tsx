"use client";

import Link from "next/link";

import { useAssessment } from "@/state/AssessmentProvider";

import {
  priyaFixture,
  raviFixture,
  anitaFixture,
} from "./fixtures";

const personas = [
  {
    name: "Priya",
    role: "Salaried",
    location: "Bengaluru",
    description: "Stable income · existing car EMI",
    number: "01",
    initials: "P",
    fixture: priyaFixture,
  },
  {
    name: "Ravi",
    role: "Self-employed",
    location: "Mysuru",
    description: "Business income · owns shop",
    number: "02",
    initials: "R",
    fixture: raviFixture,
  },
  {
    name: "Anita",
    role: "Gig worker",
    location: "Hubballi",
    description: "Variable income · existing debt",
    number: "03",
    initials: "A",
    fixture: anitaFixture,
  },
];

export function DemoModePicker() {
  const { loadFixture } = useAssessment();

  return (
    <section className="mt-10">
      <div className="overflow-hidden border-y border-slate-200 bg-white">
        <div className="grid md:grid-cols-3">
          {personas.map((persona, index) => (
            <Link
              key={persona.name}
              href="/assessment"
              onClick={() => loadFixture(persona.fixture)}
              className={`
                group relative
                border-slate-200
                focus:outline-none
                focus-visible:z-10
                focus-visible:ring-2
                focus-visible:ring-blue-600
                focus-visible:ring-offset-2
                ${
                  index !== 0
                    ? "border-t md:border-l md:border-t-0"
                    : ""
                }
              `}
            >
              <article
                className="
                  relative h-full
                  px-6 py-7
                  transition-colors duration-200
                  hover:bg-slate-50/70
                "
              >
                {/* Top */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-slate-400">
                    {persona.number}
                  </span>

                  <span
                    className="
                      flex h-8 w-8 items-center justify-center
                      rounded-full
                      border border-slate-200
                      text-sm text-slate-400
                      transition-all duration-200
                      group-hover:border-blue-200
                      group-hover:bg-blue-600
                      group-hover:text-white
                    "
                  >
                    →
                  </span>
                </div>

                {/* Initial */}
                <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg font-semibold text-slate-700 transition-colors duration-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                  {persona.initials}
                </div>

                {/* Identity */}
                <div className="mt-5">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {persona.name}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-blue-600">
                    {persona.role}
                    <span className="mx-1.5 text-slate-300">·</span>
                    {persona.location}
                  </p>
                </div>

                {/* Financial context */}
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-sm leading-6 text-slate-500">
                    {persona.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-6 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    Explore profile
                  </span>

                  <span className="text-xs text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-600">
                    →
                  </span>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Context */}
      <p className="mt-4 text-center text-xs text-slate-400">
        Each profile produces a different borrowing recommendation.
      </p>
    </section>
  );
}