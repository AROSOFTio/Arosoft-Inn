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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Production-ready systems for serious businesses.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We build scalable, secure, and intuitive digital infrastructure to power your daily operations.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-12">
                <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto p-1">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                  <TabsTrigger value="automation">Automation</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
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
        />
      </main>

      <Footer />
    </div>
  );
}
