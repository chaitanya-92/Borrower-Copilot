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
    image:
      "https://openclipart.org/image/800px/221175",
    fixture: priyaFixture,
  },
  {
    name: "Ravi",
    role: "Self-employed",
    location: "Mysuru",
    description: "Business income · owns shop",
    number: "02",
    image:
      "https://img.magnific.com/premium-vector/beautiful-professional-cartoon-character-design-vector-illustration_1253044-33615.jpg?q=80&semt=ais_hybrid&w=740",
    fixture: raviFixture,
  },
  {
    name: "Anita",
    role: "Gig worker",
    location: "Hubballi",
    description: "Variable income · existing debt",
    number: "03",
    image:
      "https://cdn.vectorstock.com/i/500p/62/65/woman-driving-delivery-motorcycle-vector-46766265.jpg",
    fixture: anitaFixture,
  },
];

export function DemoModePicker() {
  const { loadFixture } = useAssessment();

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-end justify-between">

        <span className="hidden text-xs font-medium text-slate-400 sm:block">
          3 profiles
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {personas.map((persona) => (
          <Link
            key={persona.name}
            href="/assessment"
            onClick={() => loadFixture(persona.fixture)}
            className="group"
          >
            <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
              
              {/* Illustration */}
              <div className="relative flex h-52 items-end justify-center overflow-hidden bg-slate-100">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[10px] border-slate-200" />

                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-50" />

                <span className="absolute left-4 top-4 z-20 text-xs font-bold text-slate-400">
                  {persona.number}
                </span>

                <img
                  src={persona.image}
                  alt={`${persona.name} demo borrower`}
                  className="relative z-10 h-48 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      {persona.name}
                    </h3>

                    <p className="mt-0.5 text-xs font-medium text-blue-600">
                      {persona.role} · {persona.location}
                    </p>
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-sm text-slate-500 transition-all group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                    →
                  </span>
                </div>

                <p className="mt-3 text-sm leading-5 text-slate-500">
                  {persona.description}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-3">
                  <span className="text-xs font-semibold text-slate-700">
                    Try this profile
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}