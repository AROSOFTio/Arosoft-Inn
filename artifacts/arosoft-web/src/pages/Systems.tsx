import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SystemCard } from "@/components/ui/SystemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";

interface SystemItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  startingPrice?: string | null;
}

export default function Systems() {
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [error, setError] = useState("");
  const categories = useMemo(
    () => Array.from(new Set(systems.map((system) => system.category))).filter(Boolean),
    [systems],
  );

  useEffect(() => {
    fetch("/api/systems")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load systems.");
        return response.json() as Promise<{ systems: SystemItem[] }>;
      })
      .then((data) => setSystems(data.systems))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Production-ready systems.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              We build scalable, secure, and intuitive digital infrastructure to power your daily operations.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-slate-100 border border-gray-200 flex-wrap h-auto p-1 rounded-xl">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">All</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {error && <p className="mb-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {systems.map((system) => (
                    <SystemCard
                      key={system.id}
                      name={system.title}
                      description={system.description}
                      bestFor={system.category}
                      price={system.startingPrice || "Request Quote"}
                    />
                  ))}
                </div>
                {systems.length === 0 && !error && <p className="text-center text-sm text-slate-500">Published systems will appear here.</p>}
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {systems.filter((system) => system.category === category).map((system) => (
                      <SystemCard
                        key={system.id}
                        name={system.title}
                        description={system.description}
                        bestFor={system.category}
                        price={system.startingPrice || "Request Quote"}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        <CTASection 
          title="Need a custom system?" 
          description="Let's build a solution tailored exactly to your operational needs."
          primaryBtnText="Request a System"
          variant="dark"
        />
      </main>

      <Footer />
    </div>
  );
}
