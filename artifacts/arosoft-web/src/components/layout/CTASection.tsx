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
  title = "Ready to buy or build with AROSOFT Labs?",
  description = "Request a system, buy a script, join the academy, or start monthly support with a clear manual payment flow.",
  primaryBtnText = "Request a System",
  primaryBtnHref = "/contact",
  variant = "dark"
}: CTASectionProps) {
  if (variant === "light") {
    return (
      <section className="py-12 px-4 md:px-6 relative bg-white border-y border-slate-200">
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
            {title}
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto mb-6">
            {description}
          </p>
          <Link href={primaryBtnHref}>
            <Button size="lg" className="h-10 px-7 text-sm bg-blue-600 hover:bg-blue-700 text-white">
              {primaryBtnText}
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 md:px-6 relative bg-[#050816]">
      <div className="container mx-auto relative z-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
          {title}
        </h2>
        <p className="text-base text-slate-400 max-w-2xl mx-auto mb-6">
          {description}
        </p>
        <Link href={primaryBtnHref}>
          <Button size="lg" className="h-10 px-7 text-sm bg-blue-600 hover:bg-blue-700 text-white">
            {primaryBtnText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
