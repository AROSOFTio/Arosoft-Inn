import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Github, ImageIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PortfolioItem {
  id: string;
  title: string;
  projectType: string;
  category: string;
  description: string;
  clientName?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  imageUrls: string[];
  tags: string[];
  featured: boolean;
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [error, setError] = useState("");
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.category)))], [items]);
  const featured = items.find((item) => item.featured) ?? items[0];

  useEffect(() => {
    fetch("/api/portfolio")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load portfolio.");
        return response.json() as Promise<{ items: PortfolioItem[] }>;
      })
      .then((data) => setItems(data.items))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="py-10 md:py-14 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Selected work.</h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Published systems, websites, templates, videos, and digital products from AROSOFT.
            </p>
          </div>
        </section>

        {featured && (
          <section className="py-8 px-4 md:px-6 bg-white">
            <div className="container mx-auto max-w-5xl">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-7 md:p-10">
                    <Badge className="w-fit mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Featured Case Study</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-slate-900">{featured.title}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{featured.description}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {featured.tags.map((tag) => <Tag key={tag} tag={tag} />)}
                    </div>
                  </div>
                  <PortfolioImage item={featured} large />
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-8 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            {error && <p className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <Tabs defaultValue="All" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="bg-slate-100 border border-gray-200 flex-wrap h-auto p-1 max-w-full overflow-x-auto justify-start sm:justify-center rounded-lg">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md px-4 py-2">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {categories.map((category) => {
                const visibleItems = category === "All" ? items : items.filter((item) => item.category === category);
                return (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {visibleItems.map((item) => <PortfolioCard key={item.id} item={item} />)}
                    </div>
                    {visibleItems.length === 0 && <p className="text-center text-sm text-slate-500">Published portfolio items will appear here.</p>}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>

        <CTASection variant="dark" />
      </main>
      <Footer />
    </div>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Card className="bg-white border-gray-200 overflow-hidden group hover:shadow-md transition-all flex flex-col h-full rounded-lg shadow-sm">
      <PortfolioImage item={item} />
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">{item.category}</Badge>
          <span className="text-xs font-semibold text-slate-500">{item.projectType}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-slate-900">{item.title}</h3>
        <p className="text-sm text-slate-600 mb-5 flex-1 line-clamp-3">{item.description}</p>
        <div className="mb-5 flex flex-wrap gap-2">{item.tags.map((tag) => <Tag key={tag} tag={tag} />)}</div>
        <div className="flex gap-2">
          {item.liveUrl && <a className="w-full" href={item.liveUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full border-slate-200"><ExternalLink className="mr-2 h-4 w-4" /> Live</Button></a>}
          {item.githubUrl && <a className="w-full" href={item.githubUrl} target="_blank" rel="noreferrer"><Button variant="outline" className="w-full border-slate-200"><Github className="mr-2 h-4 w-4" /> Code</Button></a>}
        </div>
      </CardContent>
    </Card>
  );
}

function PortfolioImage({ item, large = false }: { item: PortfolioItem; large?: boolean }) {
  const image = item.imageUrls[0];
  return (
    <div className={`${large ? "min-h-[280px]" : "h-48"} bg-slate-50 border-b border-gray-100 flex items-center justify-center overflow-hidden`}>
      {image ? <img src={image} alt={item.title} className="h-full w-full object-cover" /> : <ImageIcon size={42} className="text-slate-300" />}
    </div>
  );
}

function Tag({ tag }: { tag: string }) {
  return <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{tag}</span>;
}
