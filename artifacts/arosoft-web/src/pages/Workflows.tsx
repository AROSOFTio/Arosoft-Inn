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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 text-center bg-slate-50 border-b border-gray-100">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Run projects with clear workflows.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            From initial contact to final deployment, AROSOFT internal tools keep teams aligned, clients informed, and code shipping.
          </p>
        </section>

        {/* Process Map */}
        <section className="py-16 px-4 md:px-6 max-w-5xl mx-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Card key={i} className="bg-white border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all rounded-xl">
                <div className="absolute -top-4 -right-2 text-6xl font-black text-slate-50 group-hover:text-blue-50 transition-colors z-0">
                  {step.id}
                </div>
                <CardContent className="p-6 relative z-10">
                  <h3 className="text-lg font-bold mb-2 text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Kanban Mockup */}
        <section className="py-24 px-4 md:px-6 bg-slate-50 border-y border-gray-100 overflow-hidden">
          <div className="container mx-auto">
            <SectionHeader title="Built-in Project Management" description="Track every task across the entire lifecycle." />
            
            <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
              {kanbanColumns.map((col, i) => (
                <div key={i} className="min-w-[280px] w-[280px] flex flex-col gap-3 snap-start">
                  <div className="flex items-center justify-between px-1">
                    <h4 className="font-semibold text-sm text-slate-900">{col.name}</h4>
                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs border-none">{col.count}</Badge>
                  </div>
                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-3 min-h-[400px] flex flex-col gap-3">
                    {col.items.map((item, j) => (
                      <div key={j} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-default hover:border-blue-200 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline" className={`text-[10px] border-none px-2 py-0.5 font-medium ${j%2===0 ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}>
                            {j%2===0 ? 'Development' : 'Design'}
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-slate-900 mb-3">{item}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            <Avatar className="w-6 h-6 border-2 border-white shadow-sm">
                              <AvatarFallback className="text-[10px] bg-slate-800 text-white">JD</AvatarFallback>
                            </Avatar>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">Today</span>
                        </div>
                      </div>
                    ))}
                    {i === 2 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center text-sm font-medium text-slate-500 cursor-pointer hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors">
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
        <section className="py-24 px-4 md:px-6 bg-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-12 text-slate-900">Empowering every role</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {roles.map((role, i) => (
                <Badge key={i} variant="outline" className="px-4 py-2 text-sm border-gray-200 bg-white text-slate-700 hover:bg-slate-50 font-medium">
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
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-sm font-medium text-slate-700">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection title="Streamline your agency today." variant="dark" />
      </main>

      <Footer />
    </div>
  );
}
