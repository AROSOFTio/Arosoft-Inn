import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const portfolio = [
  { name: "FinTech Dashboard", category: "Systems", tags: ["React", "Node.js", "PostgreSQL"], desc: "A comprehensive internal dashboard for processing high-volume transactions securely.", color: "from-blue-50 to-cyan-50" },
  { name: "National University Portal", category: "Websites", tags: ["Next.js", "CMS", "Tailwind"], desc: "Modern, accessible website serving over 50,000 students and faculty.", color: "from-violet-50 to-indigo-50" },
  { name: "Retail Inventory Manager", category: "Automation", tags: ["Python", "AWS", "AI"], desc: "Automated stock prediction and ordering system reducing stockouts by 40%.", color: "from-emerald-50 to-teal-50" },
  { name: "E-Commerce Mobile App", category: "Templates", tags: ["React Native", "Expo"], desc: "A premium shopping template used by dozens of boutiques to launch fast.", color: "from-rose-50 to-red-50" },
  { name: "Corporate Promo Video", category: "Videos", tags: ["Premiere", "After Effects"], desc: "High-impact brand storytelling for a major telecommunications provider.", color: "from-fuchsia-50 to-pink-50" },
  { name: "Code Review Assistant", category: "Academy", tags: ["OpenAI", "CRAG", "TypeScript"], desc: "An internal learning tool built to mentor junior developers automatically.", color: "from-slate-100 to-gray-100" },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-10 md:py-14 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Selected work.
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Explore the systems, templates, and digital experiences we've crafted for ambitious teams.
            </p>
          </div>
        </section>

        {/* Featured Case Study */}
        <section className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Featured Case Study</Badge>
                  <h2 className="text-2xl md:text-4xl font-bold mb-6 text-slate-900">Enterprise Logistics Platform</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Problem</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">A regional logistics firm was managing hundreds of daily dispatches using fragmented spreadsheets, leading to errors and delays.</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Solution</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">A custom real-time tracking dashboard with automated driver assignment, built on a robust Node.js/React stack.</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Outcome</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">Reduced dispatch times by 65% and entirely eliminated data-entry errors within the first month.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 min-h-[300px] flex items-center justify-center p-8 border-l border-gray-100">
                  {/* Abstract UI representation */}
                  <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-md p-4 space-y-4">
                    <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
                    <div className="space-y-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex gap-2">
                          <div className="h-8 w-8 rounded bg-slate-100"></div>
                          <div className="h-8 flex-1 rounded bg-slate-100"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="bg-slate-100 border border-gray-200 flex-wrap h-auto p-1 max-w-full overflow-x-auto justify-start sm:justify-center rounded-xl">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">All</TabsTrigger>
                  <TabsTrigger value="Systems" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Systems</TabsTrigger>
                  <TabsTrigger value="Websites" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Websites</TabsTrigger>
                  <TabsTrigger value="Videos" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Videos</TabsTrigger>
                  <TabsTrigger value="Templates" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Templates</TabsTrigger>
                  <TabsTrigger value="Academy" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Academy</TabsTrigger>
                  <TabsTrigger value="Automation" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Automation</TabsTrigger>
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

        <CTASection variant="dark" />
      </main>

      <Footer />
    </div>
  );
}

function PortfolioCard({ name, category, tags, desc, color }: any) {
  return (
    <Card className="bg-white border-gray-200 overflow-hidden group hover:shadow-md transition-all flex flex-col h-full rounded-xl shadow-sm">
      <div className={`h-48 bg-gradient-to-br ${color} w-full relative border-b border-gray-100`}>
         <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm border-gray-200 font-medium">{category}</Badge>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-slate-900">{name}</h3>
        <p className="text-sm text-slate-600 mb-6 flex-1">{desc}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag: string, i: number) => (
            <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        <Button variant="outline" className="w-full border-slate-200 text-slate-900 hover:bg-slate-50 font-medium">
          View Case Study
        </Button>
      </CardContent>
    </Card>
  );
}
