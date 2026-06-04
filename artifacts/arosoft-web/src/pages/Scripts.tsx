import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, Code2 } from "lucide-react";
import { Link } from "wouter";

const scripts = [
  { title: "SaaS Landing Page Pro", category: "Website Templates", price: "$29", desc: "A high-converting, fully responsive landing page template built with React and Tailwind." },
  { title: "Admin Dashboard UI Kit", category: "Admin Dashboards", price: "$49", desc: "Comprehensive dashboard components, charts, and layouts for your next internal tool." },
  { title: "Multi-step Form Builder", category: "Business Forms", price: "$15", desc: "Easily create complex, validated multi-step forms with this plug-and-play script." },
  { title: "Email Automation Script", category: "Automation Scripts", price: "$25", desc: "Node.js script to automate customized email campaigns connected to your database." },
  { title: "Dynamic Invoice Generator", category: "Invoice Templates", price: "$19", desc: "Generate PDF invoices dynamically from JSON data. Perfect for billing systems." },
  { title: "Portfolio V2", category: "Portfolio Templates", price: "$15", desc: "A sleek, minimal portfolio template for developers and designers to showcase their work." },
  { title: "AI Prompt Engineering Pack", category: "AI Prompt Packs", price: "$5", desc: "Over 200 optimized prompts for coding, debugging, and system architecture planning." },
  { title: "Authentication Starter", category: "Website Templates", price: "$35", desc: "Complete auth flow (login, register, reset, OAuth) ready to drop into your Next.js app." },
];

export default function Scripts() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Premium scripts and templates.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12">
              Accelerate your development with production-ready code, beautiful UI kits, and automated workflows.
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                placeholder="Search for templates, scripts, or packs..." 
                className="h-14 pl-12 bg-white border-gray-200 rounded-xl text-lg focus-visible:ring-blue-500 shadow-sm"
              />
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {["All", "Website Templates", "Admin Dashboards", "Business Forms", "Automation Scripts", "AI Prompt Packs"].map(cat => (
                <Button key={cat} variant="outline" className={`rounded-full border-gray-200 ${cat === "All" ? "bg-blue-50 text-blue-700 border-blue-200 font-medium" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {cat}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scripts.map((script, i) => (
                <Card key={i} className="bg-white border-gray-200 flex flex-col hover:shadow-md transition-shadow rounded-xl overflow-hidden shadow-sm">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-slate-50 border-b border-gray-100 flex items-center justify-center relative">
                       <Code2 size={48} className="text-slate-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 text-xs font-medium border-none">{script.category}</Badge>
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border-none">From {script.price}</Badge>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{script.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{script.desc}</p>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 flex gap-2">
                    <Button variant="outline" className="w-full border-slate-200 text-slate-900 hover:bg-slate-50 text-sm">Preview</Button>
                    <Button className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white">Buy Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto">
            <SectionHeader title="Why buy from AROSOFT?" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { title: "Clean Code", desc: "Strictly typed, well-commented, and follows modern best practices." },
                { title: "Easy Customization", desc: "Designed to be extended. Just drop it in and tweak the config." },
                { title: "Affordable Pricing", desc: "Premium quality tools accessible to developers everywhere." },
                { title: "Support Included", desc: "Stuck? Our technical support team is here to help you deploy." }
              ].map((feature, i) => (
                <div key={i} className="text-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
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
