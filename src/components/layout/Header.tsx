import Link from "next/link";

import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Borrower Copilot home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm transition-colors group-hover:bg-blue-700">
            B
          </span>

          <span className="font-sans text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
            Borrower Copilot
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-slate-400 sm:block">
            Borrow smarter. Borrow with confidence.
          </span>
        </div>
      </div>
    </header>
  );
}