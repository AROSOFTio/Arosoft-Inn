import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PaymentRequestDialog } from "@/components/payments/PaymentRequestDialog";
import { Search, CheckCircle2, Code2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ScriptTemplate {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: string;
  previewUrl?: string | null;
  imageUrl?: string | null;
}

const marketplaceCategories = ["All", "Website", "Dashboard", "Invoice", "Automation", "AI Prompts"];

export default function Scripts() {
  const [scripts, setScripts] = useState<ScriptTemplate[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");
  const categories = useMemo(
    () => [
      ...marketplaceCategories,
      ...Array.from(new Set(scripts.map((script) => script.category)))
        .filter(Boolean)
        .filter((item) => !marketplaceCategories.includes(item)),
    ],
    [scripts],
  );
  const filteredScripts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return scripts.filter((script) => {
      const matchesCategory = category === "All" || script.category === category;
      const matchesSearch =
        !normalized ||
        script.title.toLowerCase().includes(normalized) ||
        script.category.toLowerCase().includes(normalized) ||
        script.description.toLowerCase().includes(normalized);

      return matchesCategory && matchesSearch;
    });
  }, [category, query, scripts]);

  useEffect(() => {
    fetch("/api/scripts")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load script templates.");
        return response.json() as Promise<{ scripts: ScriptTemplate[] }>;
      })
      .then((data) => setScripts(data.scripts))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-8 md:py-10 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Buy premium scripts and templates.
            </h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto mb-5">
              Production-ready code, UI kits, and automation packs with manual payment confirmation before delivery.
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                placeholder="Search for templates, scripts, or packs..." 
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 pl-12 bg-white border-gray-200 rounded-lg text-base focus-visible:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
        </section>

        <section className="py-7 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-5">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant="outline"
                  size="sm"
                  className={`rounded-full border-gray-200 ${cat === category ? "bg-blue-50 text-blue-700 border-blue-200 font-medium" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {error && <p className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredScripts.map((script) => (
                <Card key={script.id} className="bg-white border-gray-200 flex flex-col hover:shadow-md transition-shadow rounded-lg overflow-hidden shadow-sm">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-slate-50 border-b border-gray-100 flex items-center justify-center relative">
                      {script.imageUrl ? (
                        <img src={script.imageUrl} alt={script.title} className="h-full w-full object-cover" />
                      ) : (
                        <Code2 size={42} className="text-slate-300" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 text-xs font-medium border-none">{script.category}</Badge>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border-none">From {script.price}</Badge>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{script.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{script.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <a className="w-full" href={script.previewUrl || "/scripts"} target={script.previewUrl ? "_blank" : undefined} rel="noreferrer">
                      <Button variant="outline" className="w-full border-slate-200 text-slate-900 hover:bg-slate-50 text-sm">Preview</Button>
                    </a>
                    <PaymentRequestDialog
                      itemType="SCRIPT_TEMPLATE"
                      itemId={script.id}
                      itemName={script.title}
                      amount={script.price}
                      triggerLabel="Buy Now"
                      triggerClassName="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white"
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
            {filteredScripts.length === 0 && !error && <p className="mt-6 text-center text-sm text-slate-500">Published templates will appear here.</p>}
          </div>
        </section>

        <section className="py-8 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto">
            <SectionHeader title="Why buy from AROSOFT?" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {[
                { title: "Clean Code", desc: "Strictly typed, well-commented, and follows modern best practices." },
                { title: "Easy Customization", desc: "Designed to be extended. Just drop it in and tweak the config." },
                { title: "Affordable Pricing", desc: "Premium quality tools accessible to developers everywhere." },
                { title: "Support Included", desc: "Stuck? Our technical support team is here to help you deploy." }
              ].map((feature, i) => (
                <div key={i} className="text-center bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-600">{feature.desc}</p>
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
