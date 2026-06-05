import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SystemCard } from "@/components/ui/SystemCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { Link } from "wouter";
import { ArrowRight, Building2, Code2, GraduationCap, Workflow, Video, BookOpen, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface FeaturedSystem {
  id: string;
  title: string;
  category: string;
  description: string;
  startingPrice?: string | null;
}

interface FeaturedScript {
  id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  previewUrl?: string | null;
  imageUrl?: string | null;
}

interface FeaturedPortfolio {
  id: string;
  title: string;
  projectType: string;
  category: string;
  description: string;
  imageUrls: string[];
  tags: string[];
}

interface FeaturedCourse {
  id: string;
  title: string;
  level: string;
  duration: string;
  description: string;
  isPremium: boolean;
}

const packages = [
  {
    type: "WEBSITE_PACKAGE" as const,
    title: "Website Launch",
    price: "From $250",
    description: "Premium business websites, landing pages, portfolios, and company profiles.",
  },
  {
    type: "SYSTEM_PACKAGE" as const,
    title: "Business System",
    price: "From $800",
    description: "Dashboards, portals, CRMs, booking systems, and workflow automation.",
  },
  {
    type: "SUPPORT_PACKAGE" as const,
    title: "Monthly Support",
    price: "From $99/mo",
    description: "Maintenance, updates, backups, monitoring, and technical support.",
  },
  {
    type: "ACADEMY_PACKAGE" as const,
    title: "Academy Access",
    price: "From $20",
    description: "Practical courses for AI, software, websites, automation, and digital skills.",
  },
  {
    type: "SCRIPT_TEMPLATE" as const,
    title: "Script Templates",
    price: "From $5",
    description: "Ready-made templates, scripts, UI kits, and deployable starter packs.",
  },
];

export default function Home() {
  const [featuredSystems, setFeaturedSystems] = useState<FeaturedSystem[]>([]);
  const [featuredScripts, setFeaturedScripts] = useState<FeaturedScript[]>([]);
  const [featuredPortfolio, setFeaturedPortfolio] = useState<FeaturedPortfolio[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>([]);

  useEffect(() => {
    fetch("/api/systems?featured=true")
      .then(async (response) => {
        if (!response.ok) return { systems: [] };
        return response.json() as Promise<{ systems: FeaturedSystem[] }>;
      })
      .then((data) => setFeaturedSystems(data.systems.slice(0, 3)))
      .catch(() => setFeaturedSystems([]));

    fetch("/api/scripts?featured=true")
      .then(async (response) => {
        if (!response.ok) return { scripts: [] };
        return response.json() as Promise<{ scripts: FeaturedScript[] }>;
      })
      .then((data) => setFeaturedScripts(data.scripts.slice(0, 3)))
      .catch(() => setFeaturedScripts([]));

    fetch("/api/portfolio?featured=true")
      .then(async (response) => {
        if (!response.ok) return { items: [] };
        return response.json() as Promise<{ items: FeaturedPortfolio[] }>;
      })
      .then((data) => setFeaturedPortfolio(data.items.slice(0, 3)))
      .catch(() => setFeaturedPortfolio([]));

    fetch("/api/courses?featured=true")
      .then(async (response) => {
        if (!response.ok) return { courses: [] };
        return response.json() as Promise<{ courses: FeaturedCourse[] }>;
      })
      .then((data) => setFeaturedCourses(data.courses.slice(0, 3)))
      .catch(() => setFeaturedCourses([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 py-12 md:py-16">
          <img
            src="/hero-tech-bg.svg"
            alt=""
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[72%] object-cover object-right opacity-80 lg:block"
            aria-hidden="true"
          />
          <img
            src="/hero-tech-bg.svg"
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-35 lg:hidden"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/20" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/75 to-transparent" aria-hidden="true" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium mb-3 text-xs">
                  AROSOFT Labs for digital revenue systems
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 leading-tight text-slate-900">
                  Buy, build, and scale digital products.
                </h1>
                <p className="text-base text-slate-600 mb-5 leading-relaxed max-w-lg">
                  Business systems, websites, script templates, academy courses, portfolio delivery, and monthly support for growing teams.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link href="/contact">
                    <Button size="lg" className="h-11 px-7 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium" data-testid="button-explore-systems">
                      Request a System <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/scripts">
                    <Button variant="outline" size="lg" className="h-11 px-7 w-full sm:w-auto border-slate-200 text-slate-900 hover:bg-slate-100 font-medium">
                      Buy Script
                    </Button>
                  </Link>
                  <Link href="/academy">
                    <Button variant="outline" size="lg" className="h-11 px-7 w-full sm:w-auto border-slate-200 text-slate-900 hover:bg-slate-100 font-medium" data-testid="button-join-academy">
                      Join Academy
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button variant="outline" size="lg" className="h-11 px-7 w-full sm:w-auto border-slate-200 text-slate-900 hover:bg-slate-100 font-medium">
                      View Portfolio
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden h-[360px] lg:block" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* What We Build */}
        <section className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="What You Can Buy" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <FeatureCard icon={<Building2 />} title="Business Systems" description="Tailor-made management systems, portals, and automation tools." />
              <FeatureCard icon={<Code2 />} title="Websites & Templates" description="Premium websites plus production-ready code templates." />
              <FeatureCard icon={<GraduationCap />} title="Academy Courses" description="Paid and free learning paths for practical digital skills." />
              <FeatureCard icon={<Workflow />} title="Workflow Tools" description="Pre-configured project management workflows." />
              <FeatureCard icon={<Video />} title="Portfolio Projects" description="Delivered websites, systems, videos, and client-facing products." />
              <FeatureCard icon={<BookOpen />} title="Monthly Support" description="Maintenance, updates, deployment help, and technical support." />
            </div>
          </div>
        </section>

        <section className="py-8 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto">
            <SectionHeader title="Packages & Pricing" description="Start with a request now. Finance confirms payment manually before delivery." />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
              {packages.map((item) => (
                <Card key={item.title} className="flex flex-col border-gray-200 bg-white shadow-sm">
                  <CardContent className="flex-1 p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">{item.price}</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <PaymentRequestDialog
                      itemType={item.type}
                      itemName={item.title}
                      amount={item.price}
                      triggerLabel="Request Payment"
                      triggerClassName="w-full bg-blue-600 text-white hover:bg-blue-700"
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Systems */}
        <section className="py-8 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto">
            <SectionHeader title="Featured Systems" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredSystems.map((system) => (
                <SystemCard
                  key={system.id}
                  name={system.title}
                  description={system.description}
                  bestFor={system.category}
                  price={system.startingPrice || "Request Quote"}
                />
              ))}
            </div>
            {featuredSystems.length === 0 && <p className="mt-6 text-center text-sm text-slate-500">Featured systems will appear after publishing from admin.</p>}
          </div>
        </section>

        {/* Premium Scripts */}
        <section className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="Premium Templates" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredScripts.map((script) => (
                <Card key={script.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-slate-50 border-b border-gray-100 flex items-center justify-center rounded-t-xl overflow-hidden">
                      {script.imageUrl ? (
                        <img src={script.imageUrl} alt={script.title} className="h-full w-full object-cover" />
                      ) : (
                        <Code2 size={42} className="text-slate-300" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200">{script.category}</Badge>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">From {script.price}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{script.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-1">{script.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <a className="w-full" href={script.previewUrl || "/scripts"} target={script.previewUrl ? "_blank" : undefined} rel="noreferrer">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-900">Preview</Button>
                    </a>
                    <PaymentRequestDialog
                      itemType="SCRIPT_TEMPLATE"
                      itemId={script.id}
                      itemName={script.title}
                      amount={script.price}
                      triggerLabel="Buy Now"
                      triggerClassName="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
            {featuredScripts.length === 0 && <p className="mt-6 text-center text-sm text-slate-500">Featured templates will appear after publishing from admin.</p>}
          </div>
        </section>

        {/* Featured Work */}
        <section className="py-8 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto">
            <SectionHeader title="Featured Work" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredPortfolio.map((item) => (
                <Card key={item.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="aspect-video bg-white border-b border-gray-100 flex items-center justify-center overflow-hidden">
                    {item.imageUrls[0] ? <img src={item.imageUrls[0]} alt={item.title} className="h-full w-full object-cover" /> : <ImageIcon size={42} className="text-slate-300" />}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">{item.category}</Badge>
                      <span className="text-xs font-semibold text-slate-500">{item.projectType}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href="/portfolio" className="w-full">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-900">View Portfolio</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {featuredPortfolio.length === 0 && <p className="mt-6 text-center text-sm text-slate-500">Featured portfolio items will appear after publishing from admin.</p>}
          </div>
        </section>

        {/* Academy Section */}
        <section className="py-8 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-4">
                AI-guided learning for practical skills.
              </h2>
              <ul className="space-y-3 mb-6">
                {["Structured courses", "Assignment tracking", "Progress dashboard", "RAG/CAG/CRAG AI study support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/academy">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">Explore Courses</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="bg-white border border-gray-200 shadow-sm p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-900">{course.title}</h4>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">{course.level}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{course.description}</p>
                  <p className="mt-3 text-xs font-semibold text-slate-500">{course.duration} / {course.isPremium ? "Premium" : "Free"}</p>
                </Card>
              ))}
              {featuredCourses.length === 0 && <p className="text-sm text-slate-500">Featured academy courses will appear after publishing from admin.</p>}
            </div>
          </div>
        </section>

        {/* Workflow Steps */}
        <section className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="How we work" />
            <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto gap-4 md:gap-0">
              {["Request", "Analyze", "Assign", "Build", "Deliver"].map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border border-gray-200 flex items-center justify-center font-bold text-slate-900 shadow-sm z-10 relative">
                      {i + 1}
                    </div>
                    <span className="mt-3 font-medium text-slate-700">{step}</span>
                  </div>
                  {i < 4 && <div className="hidden md:block w-24 h-px bg-gray-200 mx-4"></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection variant="dark" />
      </main>
      <Footer />
    </div>
  );
}
