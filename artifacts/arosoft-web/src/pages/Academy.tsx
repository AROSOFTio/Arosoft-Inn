import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Brain, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const courses = [
  { title: "Basic Computer Skills", level: "Beginner", duration: "4 Weeks", premium: false, desc: "Master the fundamentals of operating systems, internet navigation, and file management." },
  { title: "Web Development", level: "Intermediate", duration: "12 Weeks", premium: true, desc: "Build modern, responsive websites using HTML, CSS, JavaScript, and React." },
  { title: "AI for Students", level: "Beginner", duration: "3 Weeks", premium: false, desc: "Learn how to use AI tools ethically to research, study, and improve academic performance." },
  { title: "AI for Business", level: "Advanced", duration: "6 Weeks", premium: true, desc: "Implement AI workflows, prompt engineering, and automation into your company operations." },
  { title: "Office Skills", level: "Beginner", duration: "4 Weeks", premium: false, desc: "Advanced proficiency in Word, Excel, PowerPoint, and modern collaborative tools." },
  { title: "Video Editing", level: "Intermediate", duration: "8 Weeks", premium: true, desc: "Professional video editing techniques using Premiere Pro and DaVinci Resolve." },
  { title: "Digital Marketing", level: "Intermediate", duration: "6 Weeks", premium: true, desc: "SEO, social media strategies, and paid advertising campaigns that convert." },
  { title: "Freelancing Skills", level: "Beginner", duration: "3 Weeks", premium: true, desc: "How to find clients, pitch projects, manage contracts, and build a freelance business." },
  { title: "System Development", level: "Advanced", duration: "16 Weeks", premium: true, desc: "Full-stack application architecture, database design, and API development." },
  { title: "Cybersecurity Basics", level: "Intermediate", duration: "5 Weeks", premium: true, desc: "Protecting digital assets, identifying vulnerabilities, and secure coding practices." },
];

const features = [
  "AI Study Guide", "AI Course Assistant", "RAG-powered Q&A", "CAG-powered learning memory", 
  "CRAG-powered answer checking", "Assignment Tracker", "Learning Progress Dashboard", 
  "Quiz Support", "Certificate on completion"
];

const pricing = [
  { name: "Free Access", price: "$0", desc: "Basic courses and community access.", features: ["Basic Courses", "Community Forum", "Self-paced Learning"] },
  { name: "Student Premium", price: "$15/mo", desc: "Full access with AI support for students.", features: ["All Courses", "AI Assistant", "Progress Tracking", "Certificates"] },
  { name: "Business Premium", price: "$49/mo", desc: "Advanced training for professionals.", features: ["Everything in Student", "Business Use Cases", "Priority Support", "1-on-1 Mentoring"] },
  { name: "Institution Plan", price: "Custom", desc: "Bulk access for schools and teams.", features: ["Custom Portal", "Admin Dashboard", "Bulk Enrollment", "API Access"] },
];

export default function Academy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 relative border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <Badge className="mb-6 bg-accent/20 text-accent hover:bg-accent/30 border-none px-3 py-1">
              Powered by RAG, CAG & CRAG
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Learn practical digital skills with AI-guided support.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10">
              Stop watching tutorials and start building. AROSOFT Academy combines rigorous curriculum with intelligent AI agents that remember your progress, answer your questions, and verify your code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8">Explore Courses</Button>
              <Button variant="outline" size="lg" className="h-12 px-8 border-white/10 bg-white/5">View Premium Access</Button>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6">
          <div className="container mx-auto">
            <SectionHeader title="Learning Paths" description="Structured curriculum for every skill level." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border-white/5 flex flex-col hover:border-white/20 transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={course.level === "Advanced" ? "destructive" : course.level === "Intermediate" ? "default" : "secondary"} className="text-xs">
                        {course.level}
                      </Badge>
                      {course.premium && <Badge variant="outline" className="border-accent text-accent">Premium</Badge>}
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{course.desc}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      
                      {/* Fake Progress */}
                      {i % 3 === 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-primary">In Progress</span>
                            <span className="text-muted-foreground">45%</span>
                          </div>
                          <Progress value={45} className="h-2 bg-white/10" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full group" variant={i % 3 === 0 ? "default" : "secondary"}>
                      <PlayCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      {i % 3 === 0 ? "Continue Course" : "View Course"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
                  <Brain size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  An academy powered by intelligent agents.
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Our platform integrates Retrieval-Augmented Generation (RAG) to provide instant context-aware answers, while CAG and CRAG memory systems track your learning style to personalize explanations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-primary" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative rounded-2xl border border-white/10 bg-[#0A1220] p-6 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1220] via-transparent to-transparent z-10 pointer-events-none"></div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 ml-8">
                    <p className="text-sm">I'm having trouble understanding how props work in React. Can you explain?</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mr-8">
                    <p className="text-sm text-primary font-medium mb-1">AI Assistant</p>
                    <p className="text-sm text-foreground/90">Based on your progress in the Web Dev course, think of props like HTML attributes (which you learned in Week 2), but for React components. Here is an example related to the project you are building...</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 ml-8">
                    <p className="text-sm">Oh, that makes sense! Let me try it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6">
          <div className="container mx-auto">
            <SectionHeader title="Simple, transparent pricing" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {pricing.map((tier, i) => (
                <Card key={i} className={`bg-card border-white/5 flex flex-col ${i === 1 ? 'border-primary shadow-[0_0_30px_-10px_rgba(37,99,235,0.3)] relative' : ''}`}>
                  {i === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="mt-4 flex items-baseline text-4xl font-bold">
                      {tier.price}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{tier.desc}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={i === 1 ? "default" : "outline"}>
                      Choose Plan
                    </Button>
                  </CardFooter>
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