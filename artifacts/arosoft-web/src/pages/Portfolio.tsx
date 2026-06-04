import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const portfolio = [
  { name: "FinTech Dashboard", category: "Systems", tags: ["React", "Node.js", "PostgreSQL"], desc: "A comprehensive internal dashboard for processing high-volume transactions securely.", color: "from-blue-600/20 to-cyan-600/20" },
  { name: "National University Portal", category: "Websites", tags: ["Next.js", "CMS", "Tailwind"], desc: "Modern, accessible website serving over 50,000 students and faculty.", color: "from-purple-600/20 to-indigo-600/20" },
  { name: "Retail Inventory Manager", category: "Automation", tags: ["Python", "AWS", "AI"], desc: "Automated stock prediction and ordering system reducing stockouts by 40%.", color: "from-green-600/20 to-emerald-600/20" },
  { name: "E-Commerce Mobile App", category: "Templates", tags: ["React Native", "Expo"], desc: "A premium shopping template used by dozens of boutiques to launch fast.", color: "from-orange-600/20 to-red-600/20" },
  { name: "Corporate Promo Video", category: "Videos", tags: ["Premiere", "After Effects"], desc: "High-impact brand storytelling for a major telecommunications provider.", color: "from-pink-600/20 to-rose-600/20" },
  { name: "Code Review Assistant", category: "Academy", tags: ["OpenAI", "CRAG", "TypeScript"], desc: "An internal learning tool built to mentor junior developers automatically.", color: "from-slate-600/20 to-gray-600/20" },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Selected work built for impact.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the systems, templates, and digital experiences we've crafted for ambitious teams.
            </p>
          </div>
        </section>

        {/* Featured Case Study */}
        <section className="py-12 px-4 md:px-6 mb-12">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-3xl border border-white/10 overflow-hidden bg-card/30 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary text-primary-foreground hover:bg-primary">Featured Case Study</Badge>
                  <h2 className="text-2xl md:text-4xl font-bold mb-6">Enterprise Logistics Platform</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Problem</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">A regional logistics firm was managing hundreds of daily dispatches using fragmented spreadsheets, leading to errors and delays.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Solution</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">A custom real-time tracking dashboard with automated driver assignment, built on a robust Node.js/React stack.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-500 uppercase tracking-wider mb-2">Outcome</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">Reduced dispatch times by 65% and entirely eliminated data-entry errors within the first month.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/20 via-[#0A1220] to-accent/20 min-h-[300px] flex items-center justify-center p-8">
                  {/* Abstract UI representation */}
                  <div className="w-full max-w-sm rounded-xl border border-white/10 bg-black/40 shadow-2xl p-4 space-y-4">
                    <div className="h-4 w-1/3 bg-white/10 rounded"></div>
                    <div className="space-y-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex gap-2">
                          <div className="h-8 w-8 rounded bg-white/5"></div>
                          <div className="h-8 flex-1 rounded bg-white/5"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto p-1 max-w-full overflow-x-auto justify-start sm:justify-center">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Systems">Systems</TabsTrigger>
                  <TabsTrigger value="Websites">Websites</TabsTrigger>
                  <TabsTrigger value="Videos">Videos</TabsTrigger>
                  <TabsTrigger value="Templates">Templates</TabsTrigger>
                  <TabsTrigger value="Academy">Academy</TabsTrigger>
                  <TabsTrigger value="Automation">Automation</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.map((item, i) => (
                    <PortfolioCard key={i} {...item} />
                  ))}
                </div>
              </TabsContent>

              {["Systems", "Websites", "Videos", "Templates", "Academy", "Automation"].map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.filter(p => p.category === category).map((item, i) => (
                      <PortfolioCard key={i} {...item} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

function PortfolioCard({ name, category, tags, desc, color }: any) {
  return (
    <Card className="bg-card/50 border-white/5 overflow-hidden group hover:border-white/20 transition-all flex flex-col h-full">
      <div className={`h-48 bg-gradient-to-br ${color} w-full relative`}>
         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
         <Badge className="absolute top-4 left-4 bg-black/50 text-white backdrop-blur-md border-white/10">{category}</Badge>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-6 flex-1">{desc}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag: string, i: number) => (
            <span key={i} className="text-[10px] uppercase tracking-wider font-medium text-white/50 bg-white/5 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <Button variant="outline" className="w-full border-white/10 group-hover:bg-white/5">
          View Case Study
        </Button>
      </CardContent>
    </Card>
  );
}