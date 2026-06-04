import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Code2, Cpu, GraduationCap, LayoutDashboard, MessageSquare, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 text-sm text-primary">
                  <Zap size={16} />
                  <span>Next-Generation Digital Infrastructure</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                  Build. <span className="text-primary">Automate.</span><br />
                  Learn. Scale.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                  AROSOFT Innovations builds digital systems, premium templates, AI-powered learning, and workflow tools for serious teams and learners.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/systems">
                    <Button size="lg" className="h-12 px-8 w-full sm:w-auto" data-testid="button-explore-systems">
                      Explore Systems <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/academy">
                    <Button variant="outline" size="lg" className="h-12 px-8 w-full sm:w-auto bg-white/5 hover:bg-white/10 border-white/10" data-testid="button-join-academy">
                      Join Academy
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative hidden lg:block h-[500px]"
              >
                {/* Abstract Dashboard Visual */}
                <div className="absolute inset-0 rounded-2xl border border-white/10 bg-[#0A1220] shadow-2xl overflow-hidden flex flex-col">
                  <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                    <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 p-6 grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-4">
                      <div className="h-32 rounded-lg border border-white/5 bg-gradient-to-br from-primary/10 to-transparent p-4">
                        <div className="w-1/3 h-4 bg-white/10 rounded mb-4"></div>
                        <div className="w-full h-16 flex items-end gap-2">
                          {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: `${h}%` }}></div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-lg border border-white/5 bg-white/5 p-4 flex flex-col justify-between">
                          <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center text-accent"><LayoutDashboard size={16} /></div>
                          <div className="w-1/2 h-4 bg-white/10 rounded"></div>
                        </div>
                        <div className="h-24 rounded-lg border border-white/5 bg-white/5 p-4 flex flex-col justify-between">
                          <div className="w-8 h-8 rounded bg-secondary/20 flex items-center justify-center text-secondary"><Code2 size={16} /></div>
                          <div className="w-1/2 h-4 bg-white/10 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-14 rounded border border-white/5 bg-white/5 flex items-center px-3 gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10"></div>
                          <div className="flex-1 space-y-2">
                            <div className="w-3/4 h-2 bg-white/20 rounded"></div>
                            <div className="w-1/2 h-2 bg-white/10 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust Stats */}
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">50+</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Systems</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">200+</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Templates</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">30+</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Courses</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground mb-2">100+</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Workflows</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4 md:px-6">
          <div className="container mx-auto">
            <SectionHeader 
              title="What We Offer" 
              description="Comprehensive digital solutions designed for impact, scalability, and performance."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<LayoutDashboard />}
                title="Custom Systems"
                description="Tailor-made management systems and client portals built to handle your specific business logic and workflows."
              />
              <FeatureCard 
                icon={<Code2 />}
                title="Script Templates"
                description="Production-ready codebase templates and automated scripts to accelerate your development process."
              />
              <FeatureCard 
                icon={<GraduationCap />}
                title="Premium Academy"
                description="High-quality, structured learning paths for digital skills, software development, and modern toolchains."
              />
              <FeatureCard 
                icon={<Cpu />}
                title="AI Learning Assistant"
                description="RAG, CAG, and CRAG-powered intelligent support to answer queries, check work, and guide your learning."
              />
              <FeatureCard 
                icon={<Zap />}
                title="Task Workflows"
                description="Pre-configured, robust project management workflows that keep your team aligned and shipping fast."
              />
              <FeatureCard 
                icon={<MessageSquare />}
                title="Client Support"
                description="Dedicated technical support and comprehensive documentation to ensure your systems run flawlessly."
              />
            </div>
          </div>
        </section>

        {/* Built For Section */}
        <section className="py-24 px-4 md:px-6 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Built for businesses,<br/>students, and creators.
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Whether you are scaling a company, learning to code, or delivering projects to clients, AROSOFT Innovations provides the foundation you need to succeed.
                </p>
                <ul className="space-y-4">
                  {[
                    "Enterprise-grade security and reliability",
                    "Seamless onboarding and documentation",
                    "Continuous updates and feature additions",
                    "Dedicated support for premium users"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 p-6 flex flex-col justify-end">
                    <div className="text-2xl font-bold">Startups</div>
                    <div className="text-sm text-muted-foreground mt-1">Accelerate growth</div>
                  </div>
                  <div className="h-64 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 p-6 flex flex-col justify-end">
                    <div className="text-2xl font-bold">Students</div>
                    <div className="text-sm text-muted-foreground mt-1">Master new skills</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 p-6 flex flex-col justify-end">
                    <div className="text-2xl font-bold">Agencies</div>
                    <div className="text-sm text-muted-foreground mt-1">Deliver faster</div>
                  </div>
                  <div className="h-48 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 flex flex-col justify-end">
                    <div className="text-2xl font-bold">Creators</div>
                    <div className="text-sm text-muted-foreground mt-1">Build your brand</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
