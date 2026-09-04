import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AssessmentProvider } from "@/state/AssessmentProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sahi Rate — Borrower Copilot",
  description:
    "Know before you borrow. Should you borrow, how much, at what rate, and what EMI?",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="min-h-screen grain-bg antialiased">
        <AssessmentProvider>
          <TooltipProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </TooltipProvider>
        </AssessmentProvider>
      </body>
    </html>
  );
}
