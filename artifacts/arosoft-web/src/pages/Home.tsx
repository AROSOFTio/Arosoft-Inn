import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SystemCard } from "@/components/ui/SystemCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Building2, Code2, GraduationCap, Workflow, Video, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

interface FeaturedSystem {
  id: string;
  title: string;
  category: string;
  description: string;
  startingPrice?: string | null;
}

export default function Home() {
  const [featuredSystems, setFeaturedSystems] = useState<FeaturedSystem[]>([]);

  useEffect(() => {
    fetch("/api/systems?featured=true")
      .then(async (response) => {
        if (!response.ok) return { systems: [] };
        return response.json() as Promise<{ systems: FeaturedSystem[] }>;
      })
      .then((data) => setFeaturedSystems(data.systems.slice(0, 3)))
      .catch(() => setFeaturedSystems([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-32 md:pb-32 bg-slate-50">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 font-medium mb-6 text-sm">
                  Next-generation digital infrastructure
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-slate-900">
                  Build. Automate. Learn. Scale.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                  Digital systems, templates, AI learning, and workflows — built for serious teams.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/systems">
                    <Button size="lg" className="h-12 px-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium" data-testid="button-explore-systems">
                      Explore Systems <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/academy">
                    <Button variant="outline" size="lg" className="h-12 px-8 w-full sm:w-auto border-slate-200 text-slate-900 hover:bg-slate-100 font-medium" data-testid="button-join-academy">
                      Join Academy
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative hidden lg:block h-[500px]">
                {/* Clean Dashboard Mockup Card */}
                <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden flex flex-col">
                  <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-slate-50">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="flex-1 p-6 grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-4">
                      <div className="h-32 rounded-lg border border-gray-100 bg-slate-50 p-4">
                        <div className="w-1/3 h-4 bg-slate-200 rounded mb-4"></div>
                        <div className="w-full h-16 flex items-end gap-2">
                          {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-blue-200 rounded-t" style={{ height: `${h}%` }}></div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-lg border border-gray-100 bg-white p-4 flex flex-col justify-between shadow-sm">
                          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-500"><Building2 size={16} /></div>
                          <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                        </div>
                        <div className="h-24 rounded-lg border border-gray-100 bg-white p-4 flex flex-col justify-between shadow-sm">
                          <div className="w-8 h-8 rounded bg-violet-50 flex items-center justify-center text-violet-500"><Code2 size={16} /></div>
                          <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-14 rounded-lg border border-gray-100 bg-white shadow-sm flex items-center px-3 gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100"></div>
                          <div className="flex-1 space-y-2">
                            <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
                            <div className="w-1/2 h-2 bg-slate-100 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Build */}
        <section className="py-24 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="What We Build" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={<Building2 />} title="Business Systems" description="Tailor-made management systems and client portals." />
              <FeatureCard icon={<Code2 />} title="Script Templates" description="Production-ready codebase templates and automated scripts." />
              <FeatureCard icon={<GraduationCap />} title="AI Academy" description="High-quality learning paths for digital skills." />
              <FeatureCard icon={<Workflow />} title="Workflow Tools" description="Pre-configured project management workflows." />
              <FeatureCard icon={<Video />} title="Premium Videos" description="High-impact brand storytelling and video editing." />
              <FeatureCard icon={<BookOpen />} title="Student Support" description="Dedicated technical support and comprehensive documentation." />
            </div>
          </div>
        </section>

        {/* Featured Systems */}
        <section className="py-24 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto">
            <SectionHeader title="Featured Systems" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <section className="py-24 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="Premium Templates" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Website Template", cat: "Websites", desc: "A high-converting, fully responsive landing page template." },
                { title: "Admin Dashboard", cat: "Dashboards", desc: "Comprehensive dashboard components and charts." },
                { title: "Invoice Template", cat: "Tools", desc: "Generate PDF invoices dynamically from JSON data." },
              ].map((script, i) => (
                <Card key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-slate-50 border-b border-gray-100 flex items-center justify-center rounded-t-xl">
                      <Code2 size={48} className="text-slate-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 flex-1">
                    <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 mb-3">{script.cat}</Badge>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{script.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-1">{script.desc}</p>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 flex gap-2">
                    <Button variant="outline" className="w-full border-slate-200 text-slate-900">Preview</Button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Buy Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Academy Section */}
        <section className="py-24 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
                AI-guided learning for practical skills.
              </h2>
              <ul className="space-y-4 mb-8">
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
              {[
                { title: "Web Development", level: "Intermediate", progress: 45 },
                { title: "AI for Business", level: "Advanced", progress: 0 },
                { title: "Digital Marketing", level: "Beginner", progress: 100 }
              ].map((course, i) => (
                <Card key={i} className="bg-white border border-gray-200 shadow-sm p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-900">{course.title}</h4>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">{course.level}</Badge>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Steps */}
        <section className="py-24 px-4 md:px-6 bg-white">
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
