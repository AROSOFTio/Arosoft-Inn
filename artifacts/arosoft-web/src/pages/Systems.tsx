import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SystemCard } from "@/components/ui/SystemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const systems = [
  {
    name: "Business Management System",
    description: "A comprehensive ERP solution tailored for modern enterprises. Includes HR, Payroll, CRM, and internal messaging.",
    bestFor: "Business",
    category: "business"
  },
  {
    name: "School Management System",
    description: "Streamline admissions, grading, attendance, and parent communication with our robust educational platform.",
    bestFor: "Education",
    category: "education"
  },
  {
    name: "Billing and Payment System",
    description: "Secure, compliant, and flexible invoicing and payment gateway integrations for subscription and one-off models.",
    bestFor: "Finance",
    category: "finance"
  },
  {
    name: "Inventory and POS System",
    description: "Real-time stock tracking, multi-location support, and a lightning-fast point of sale interface.",
    bestFor: "Business",
    category: "business"
  },
  {
    name: "Client Portals",
    description: "White-labeled, secure environments for your clients to view project progress, pay invoices, and submit tickets.",
    bestFor: "Custom",
    category: "custom"
  },
  {
    name: "AI Workflow Systems",
    description: "Automate repetitive tasks, data extraction, and customer support triage using advanced AI agents.",
    bestFor: "Automation",
    category: "automation"
  }
];

export default function Systems() {
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
                  <TabsTrigger value="business" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Business</TabsTrigger>
                  <TabsTrigger value="education" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Education</TabsTrigger>
                  <TabsTrigger value="finance" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Finance</TabsTrigger>
                  <TabsTrigger value="automation" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Automation</TabsTrigger>
                  <TabsTrigger value="custom" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2">Custom</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {systems.map((system, i) => (
                    <SystemCard key={i} {...system} />
                  ))}
                </div>
              </TabsContent>

              {["business", "education", "finance", "automation", "custom"].map((category) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {systems.filter(s => s.category === category).map((system, i) => (
                      <SystemCard key={i} {...system} />
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
