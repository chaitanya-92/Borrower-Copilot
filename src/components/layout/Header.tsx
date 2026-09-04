import Link from "next/link";
import { cn } from "@/lib/utils";

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("border-b border-border py-4", className)}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold uppercase tracking-wider text-primary">
          Borrower Copilot
          </span>

        </Link>
      </div>
    </header>
  );
}
