import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { DemoModePicker } from "@/features/walkthrough/DemoModePicker";

export default function HomePage() {
  return (
    <PageContainer className="py-16">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-primary">Borrower Copilot</p>
        <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-tight md:text-7xl">
          Know Before
          <br />
          <span className="text-primary text-glow">You Borrow</span>
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          Four answers before you walk into a lender: Should I borrow? How much am I eligible
          for? What&apos;s a fair rate? What EMI should I agree to?
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/assessment">Start Assessment</Link>
        </Button>
        <DemoModePicker />
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-4">
        {[
          { n: "01", title: "Verdict", desc: "Borrow, borrow less, or don't borrow" },
          { n: "02", title: "Capacity", desc: "Lender max vs safe max loan amount" },
          { n: "03", title: "Fair Rate", desc: "Rate band and all-in APR" },
          { n: "04", title: "EMI", desc: "Ceiling, tenure trade-offs, stress test" },
        ].map((item) => (
          <div key={item.n} className="rounded-lg border border-border p-6">
            <span className="font-display text-3xl font-bold text-primary">{item.n}</span>
            <h3 className="mt-2 font-display text-lg font-bold uppercase">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
