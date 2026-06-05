import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CTASection } from "@/components/layout/CTASection";
import { Users, Target, Globe, Award } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Purpose-Driven",
    description: "We build tools and systems that solve real operational problems for businesses and learners.",
  },
  {
    icon: Users,
    title: "Team-Focused",
    description: "Our workflows are designed to bring clarity and accountability to every team and project.",
  },
  {
    icon: Globe,
    title: "Built for Growth",
    description: "From solo founders to institutions — our products scale with your ambitions.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "Every product we ship meets a premium standard: clean code, clean design, real documentation.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#F8FAFC] border-b border-slate-100 py-10 md:py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="inline-block mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            About AROSOFT Labs
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-5">
            We build digital infrastructure for serious teams.
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed">
            AROSOFT Labs is the public product and service brand operated by AROSOFT Innovations Ltd. We sell and deliver systems,
            websites, templates, academy courses, portfolio projects, and support packages.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-3 block">Our Mission</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Equip every team and learner with the tools they need.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We started AROSOFT Labs to bridge the gap between complex enterprise software and the practical
                needs of growing businesses and students across East Africa and beyond.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "50+", label: "Systems Built" },
                { value: "200+", label: "Templates" },
                { value: "30+", label: "Courses" },
                { value: "100+", label: "Workflows" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm"
                  data-testid={`about-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#F8FAFC] border-y border-slate-100 py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase mb-3 block">What We Stand For</span>
            <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                data-testid={`value-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
