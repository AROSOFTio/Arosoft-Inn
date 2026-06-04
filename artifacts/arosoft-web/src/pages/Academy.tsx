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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
          <div className="container mx-auto max-w-4xl text-center">
            <Badge className="mb-6 bg-violet-100 text-violet-700 hover:bg-violet-200 border-none px-3 py-1 font-medium">
              Powered by RAG, CAG & CRAG
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
              Learn practical digital skills.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10">
              Stop watching tutorials and start building. AROSOFT Academy combines rigorous curriculum with intelligent AI agents that remember your progress, answer your questions, and verify your code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium">Explore Courses</Button>
              <Button variant="outline" size="lg" className="h-12 px-8 border-slate-200 text-slate-900 hover:bg-slate-100 font-medium">View Premium Access</Button>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="Learning Paths" description="Structured curriculum for every skill level." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <Card key={i} className="bg-white border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-all rounded-xl">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 font-medium border-none">
                        {course.level}
                      </Badge>
                      {course.premium && <Badge variant="outline" className="border-violet-200 text-violet-700 bg-violet-50">Premium</Badge>}
                    </div>
                    <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-slate-600 mb-6 line-clamp-3">{course.desc}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-slate-500 gap-2 font-medium">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      
                      {i % 3 === 0 && (
                        <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-blue-600">In Progress</span>
                            <span className="text-slate-600">45%</span>
                          </div>
                          <Progress value={45} className="h-2 bg-gray-200" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className={`w-full group font-medium ${i % 3 === 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"}`}>
                      <PlayCircle className={`mr-2 h-4 w-4 group-hover:scale-110 transition-transform ${i % 3 !== 0 && "text-slate-500"}`} />
                      {i % 3 === 0 ? "Continue Course" : "View Course"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6 bg-slate-50 border-y border-gray-100">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-6 shadow-sm border border-blue-200">
                  <Brain size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                  An academy powered by intelligent agents.
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Our platform integrates Retrieval-Augmented Generation (RAG) to provide instant context-aware answers, while CAG and CRAG memory systems track your learning style to personalize explanations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="bg-slate-100 rounded-xl p-4 ml-8 rounded-tr-sm">
                    <p className="text-sm text-slate-800">I'm having trouble understanding how props work in React. Can you explain?</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mr-8 rounded-tl-sm">
                    <p className="text-sm text-blue-700 font-bold mb-1">AI Assistant</p>
                    <p className="text-sm text-slate-700">Based on your progress in the Web Dev course, think of props like HTML attributes (which you learned in Week 2), but for React components. Here is an example related to the project you are building...</p>
                  </div>
                  <div className="bg-slate-100 rounded-xl p-4 ml-8 rounded-tr-sm">
                    <p className="text-sm text-slate-800">Oh, that makes sense! Let me try it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-6 bg-white">
          <div className="container mx-auto">
            <SectionHeader title="Simple, transparent pricing" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {pricing.map((tier, i) => (
                <Card key={i} className={`bg-white flex flex-col rounded-xl overflow-hidden ${i === 1 ? 'border-2 border-blue-500 shadow-lg relative' : 'border border-gray-200 shadow-sm'}`}>
                  {i === 1 && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-blue-500"></div>
                  )}
                  <CardHeader className="pt-8">
                    {i === 1 && (
                      <div className="mb-2 self-start px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        Most Popular
                      </div>
                    )}
                    <CardTitle className="text-xl text-slate-900">{tier.name}</CardTitle>
                    <div className="mt-4 flex items-baseline text-4xl font-bold text-slate-900">
                      {tier.price}
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{tier.desc}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {tier.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={16} className="text-blue-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pb-8">
                    <Button className="w-full font-medium" variant={i === 1 ? "default" : "outline"} style={i===1 ? {backgroundColor: '#2563EB', color: 'white'} : {}}>
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
