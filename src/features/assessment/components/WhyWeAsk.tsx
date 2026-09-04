"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhyWeAsk({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 border-t border-border/60 pt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        aria-expanded={open}
      >
        <span>Why we ask</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
