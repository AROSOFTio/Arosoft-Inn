import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  variant?: "light" | "dark";
}

export function CTASection({
  title = "Ready to build with AROSOFT Innovations?",
  description = "Join serious teams and learners building the future with our premium systems.",
  primaryBtnText = "Request a Project",
  primaryBtnHref = "/contact",
  variant = "dark"
}: CTASectionProps) {
  if (variant === "light") {
    return (
      <section className="py-24 px-4 md:px-6 relative bg-white border-y border-slate-200">
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            {description}
          </p>
          <Link href={primaryBtnHref}>
            <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white">
              {primaryBtnText}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 md:px-6 relative bg-[#050816]">
      <div className="container mx-auto relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          {title}
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          {description}
        </p>
        <Link href={primaryBtnHref}>
          <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white">
            {primaryBtnText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
