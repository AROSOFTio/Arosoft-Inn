import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, UserSquare, Code2, ShieldAlert, Inbox, CreditCard } from "lucide-react";

const dashboards = [
  {
    title: "Client Dashboard",
    icon: <UserSquare className="w-8 h-8 text-blue-600" />,
    desc: "A secure portal for clients to track project progress, view invoices, approve milestones, and submit support tickets.",
    color: "bg-blue-50 border-blue-100"
  },
  {
    title: "Student Dashboard",
    icon: <LayoutDashboard className="w-8 h-8 text-violet-600" />,
    desc: "Personalized learning environment tracking course progress, AI assistant interactions, and assignment grades.",
    color: "bg-violet-50 border-violet-100"
  },
  {
    title: "Developer Dashboard",
    icon: <Code2 className="w-8 h-8 text-indigo-600" />,
    desc: "Centralized hub for engineers to manage assigned tasks, access script templates, and review code pull requests.",
    color: "bg-indigo-50 border-indigo-100"
  },
  {
    title: "Admin Dashboard",
    icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
    desc: "Complete oversight of all company operations, user management, system health metrics, and global settings.",
    color: "bg-rose-50 border-rose-100"
  },
  {
    title: "Support Inbox",
    icon: <Inbox className="w-8 h-8 text-emerald-600" />,
    desc: "Unified communication center handling inquiries, complaints, technical issues, and academy guidance.",
    color: "bg-emerald-50 border-emerald-100"
  },
  {
    title: "Finance & Compliance",
    icon: <CreditCard className="w-8 h-8 text-amber-600" />,
    desc: "Financial tracking for script sales, academy subscriptions, custom system billing, and tax compliance.",
    color: "bg-amber-50 border-amber-100"
  }
];

export default function DashboardPreview() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Dashboard Previews
            </h1>
            <p className="text-lg md:text-xl text-slate-600">
              A glimpse into the internal tools, client portals, and administrative interfaces that power AROSOFT Innovations.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map((dash, i) => (
                <Card key={i} className={`bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200 group rounded-xl shadow-sm flex flex-col`}>
                  <CardHeader className="flex-1">
                    <div className={`w-16 h-16 rounded-xl ${dash.color} flex items-center justify-center mb-4 border`}>
                      {dash.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{dash.title}</CardTitle>
                    <CardDescription className="text-sm mt-2 text-slate-600 leading-relaxed font-medium">{dash.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6">
                    <Button variant="outline" className="w-full justify-between border-slate-200 text-slate-900 hover:bg-slate-50 font-medium">
                      Preview Interface
                      <ArrowRight className="w-4 h-4 ml-2 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
