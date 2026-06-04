import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
}

export function CTASection({
  title = "Ready to build with AROSOFT Innovations?",
  description = "Join serious teams and learners building the future with our premium systems.",
  primaryBtnText = "Request a Project",
  primaryBtnHref = "/contact",
}: CTASectionProps) {
  return (
    <section className="py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-primary/5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          {description}
        </p>
        <Link href={primaryBtnHref}>
          <Button size="lg" className="h-12 px-8 text-base">
            {primaryBtnText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
