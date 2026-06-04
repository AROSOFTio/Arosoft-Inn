import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const steps = [
  { id: "01", title: "Client Request", desc: "Initial requirement gathering and scope definition." },
  { id: "02", title: "AI Analysis", desc: "System architecture and feasibility checks using AI." },
  { id: "03", title: "Admin Review", desc: "Project approval, resource allocation, and timeline setting." },
  { id: "04", title: "Task Assignment", desc: "Breaking down the project into trackable kanban tasks." },
  { id: "05", title: "Developer Execution", desc: "Active coding, design, and implementation phase." },
  { id: "06", title: "Quality Review", desc: "Testing, code review, and performance auditing." },
  { id: "07", title: "Client Delivery", desc: "Deployment, handover, and client onboarding." },
  { id: "08", title: "Support", desc: "Ongoing maintenance, updates, and troubleshooting." },
];

const roles = [
  "Frontend Dev", "Backend Dev", "Fullstack Dev", "UI/UX Designer", 
  "Marketing Team", "Video Editor", "Finance/Admin", "Support Team"
];

const kanbanColumns = [
  { name: "New Request", count: 3, items: ["E-commerce App", "Landing Page redesign"] },
  { name: "In Review", count: 1, items: ["School ERP Specs"] },
  { name: "Assigned", count: 4, items: ["Auth Module", "Database Schema"] },
  { name: "In Progress", count: 2, items: ["Dashboard UI", "Payment Gateway API"] },
  { name: "Testing", count: 2, items: ["Admin Panel", "Email Worker"] },
  { name: "Completed", count: 12, items: ["User Profiles", "Settings Page"] },
];

export default function Workflows() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 relative text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Run projects with clear workflows.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            From initial contact to final deployment, AROSOFT internal tools keep teams aligned, clients informed, and code shipping.
          </p>
        </section>

        {/* Process Map */}
        <section className="py-12 px-4 md:px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <Card key={i} className="bg-card/50 border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 text-4xl font-black text-white/5 group-hover:text-primary/10 transition-colors">
                  {step.id}
                </div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Kanban Mockup */}
        <section className="py-24 px-4 md:px-6 bg-[#0A1220] border-y border-white/5 overflow-hidden">
          <div className="container mx-auto">
            <SectionHeader title="Built-in Project Management" description="Track every task across the entire lifecycle." />
            
            <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
              {kanbanColumns.map((col, i) => (
                <div key={i} className="min-w-[280px] w-[280px] flex flex-col gap-3 snap-start">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="font-semibold text-sm">{col.name}</h4>
                    <Badge variant="secondary" className="bg-white/10 text-xs">{col.count}</Badge>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2 min-h-[400px] flex flex-col gap-2">
                    {col.items.map((item, j) => (
                      <div key={j} className="bg-card border border-white/5 rounded-lg p-3 shadow-sm cursor-default hover:border-white/20 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline" className={`text-[10px] border-none px-2 py-0 ${j%2===0 ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'}`}>
                            {j%2===0 ? 'Development' : 'Design'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-3">{item}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            <Avatar className="w-6 h-6 border-2 border-card">
                              <AvatarFallback className="text-[10px] bg-secondary text-white">JD</AvatarFallback>
                            </Avatar>
                          </div>
                          <span className="text-xs text-muted-foreground">Today</span>
                        </div>
                      </div>
                    ))}
                    {i === 2 && (
                      <div className="border-2 border-dashed border-white/10 rounded-lg p-3 text-center text-xs text-muted-foreground cursor-pointer hover:border-white/20 hover:text-foreground transition-colors">
                        + Add Task
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <section className="py-24 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-12">Empowering every role</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map((role, i) => (
                <Badge key={i} variant="outline" className="px-4 py-2 text-sm border-white/10 bg-white/5 hover:bg-white/10">
                  {role}
                </Badge>
              ))}
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-8 text-left">
              {[
                "Assignment tracking", "Deadlines & Alerts", "Secure File Uploads", "Team Comments",
                "Status Updates", "Client Visibility", "Admin Approval", "Audit Trails"
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection title="Streamline your agency today." />
      </main>

      <Footer />
    </div>
  );
}