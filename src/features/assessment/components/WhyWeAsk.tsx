import { Info } from "lucide-react";

export function WhyWeAsk({ text }: { text: string }) {
  return (
    <div className="mt-7 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <Info className="h-4 w-4" />
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
            Why we ask
          </p>

          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}