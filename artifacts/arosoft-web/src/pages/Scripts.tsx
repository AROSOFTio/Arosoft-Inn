import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 relative">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Premium scripts and templates <br className="hidden md:block"/>from <span className="text-primary">$5</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Accelerate your development with production-ready code, beautiful UI kits, and automated workflows.
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search for templates, scripts, or packs..." 
                className="h-14 pl-12 bg-white/5 border-white/10 rounded-xl text-lg focus-visible:ring-primary/50"
              />
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-12">
              {["All", "Website Templates", "Admin Dashboards", "Business Forms", "Automation Scripts", "AI Prompt Packs"].map(cat => (
                <Button key={cat} variant="outline" className={`rounded-full border-white/10 ${cat === "All" ? "bg-white/10 text-foreground" : "bg-transparent text-muted-foreground"}`}>
                  {cat}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scripts.map((script, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border-white/5 flex flex-col hover:border-primary/30 transition-colors group">
                  <CardHeader className="p-0">
                    <div className="aspect-video bg-white/5 rounded-t-xl relative overflow-hidden group-hover:bg-white/10 transition-colors flex items-center justify-center">
                       <Code2 size={48} className="text-white/20" />
                       <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground font-semibold">
                         {script.price}
                       </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 flex-1">
                    <div className="text-xs text-primary mb-2 font-medium">{script.category}</div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-1">{script.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{script.desc}</p>
                  </CardContent>
                  <CardFooter className="p-5 pt-0 flex gap-2">
                    <Button variant="outline" className="w-full border-white/10 text-xs">Preview</Button>
                    <Button className="w-full text-xs">Buy Now</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto">
            <SectionHeader title="Why buy from AROSOFT?" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { title: "Clean Code", desc: "Strictly typed, well-commented, and follows modern best practices." },
                { title: "Easy Customization", desc: "Designed to be extended. Just drop it in and tweak the config." },
                { title: "Affordable Pricing", desc: "Premium quality tools accessible to developers everywhere." },
                { title: "Support Included", desc: "Stuck? Our technical support team is here to help you deploy." }
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

// Quick inline component for the icon since we didn't import it at the top
import { Code2 } from "lucide-react";