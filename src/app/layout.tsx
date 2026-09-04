import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AssessmentProvider } from "@/state/AssessmentProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Borrower Copilot",
  description:
    "Know before you borrow. Should you borrow, how much, at what rate, and what EMI?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="min-h-screen antialiased">
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