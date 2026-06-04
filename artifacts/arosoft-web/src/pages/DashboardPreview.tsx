import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, UserSquare, Code2, ShieldAlert, Inbox, CreditCard } from "lucide-react";

const dashboards = [
  {
    title: "Client Dashboard",
    icon: <UserSquare className="w-8 h-8 text-primary" />,
    desc: "A secure portal for clients to track project progress, view invoices, approve milestones, and submit support tickets.",
    color: "bg-blue-500/10 border-blue-500/20"
  },
  {
    title: "Student Dashboard",
    icon: <LayoutDashboard className="w-8 h-8 text-accent" />,
    desc: "Personalized learning environment tracking course progress, AI assistant interactions, and assignment grades.",
    color: "bg-cyan-500/10 border-cyan-500/20"
  },
  {
    title: "Developer Dashboard",
    icon: <Code2 className="w-8 h-8 text-secondary" />,
    desc: "Centralized hub for engineers to manage assigned tasks, access script templates, and review code pull requests.",
    color: "bg-purple-500/10 border-purple-500/20"
  },
  {
    title: "Admin Dashboard",
    icon: <ShieldAlert className="w-8 h-8 text-destructive" />,
    desc: "Complete oversight of all company operations, user management, system health metrics, and global settings.",
    color: "bg-red-500/10 border-red-500/20"
  },
  {
    title: "Support Inbox",
    icon: <Inbox className="w-8 h-8 text-green-500" />,
    desc: "Unified communication center handling inquiries, complaints, technical issues, and academy guidance.",
    color: "bg-green-500/10 border-green-500/20"
  },
  {
    title: "Finance & Compliance",
    icon: <CreditCard className="w-8 h-8 text-yellow-500" />,
    desc: "Financial tracking for script sales, academy subscriptions, custom system billing, and tax compliance.",
    color: "bg-yellow-500/10 border-yellow-500/20"
  }
];

export default function DashboardPreview() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Dashboard Previews
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              A glimpse into the internal tools, client portals, and administrative interfaces that power AROSOFT Innovations.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map((dash, i) => (
                <Card key={i} className={`bg-card/50 backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all group`}>
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-xl ${dash.color} flex items-center justify-center mb-4`}>
                      {dash.icon}
                    </div>
                    <CardTitle className="text-xl">{dash.title}</CardTitle>
                    <CardDescription className="text-sm mt-2">{dash.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full justify-between border-white/10 group-hover:bg-white/5">
                      Preview Interface
                      <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
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