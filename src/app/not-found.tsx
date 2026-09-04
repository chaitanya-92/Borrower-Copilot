import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <PageContainer className="py-24 text-center">
      <h1 className="font-display text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-muted-foreground">Page not found.</p>
      <Button asChild className="mt-8">
        <Link href="/">Go Home</Link>
      </Button>
    </PageContainer>
  );
}
