import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as your name, email address, phone number, and organization details when you submit a contact form or request a project. We also collect basic usage data to improve our services.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information we collect to respond to your inquiries, fulfill project requests, send service updates, and improve our products. We do not sell your personal information to third parties.",
  },
  {
    title: "Data Storage and Security",
    content:
      "Your data is stored securely on our servers. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, loss, or misuse.",
  },
  {
    title: "Cookies",
    content:
      "We use cookies and similar tracking technologies to improve your browsing experience. You may disable cookies in your browser settings, though some features of the site may not function correctly as a result.",
  },
  {
    title: "Third-Party Services",
    content:
      "We may use third-party services such as email delivery providers. These providers have access only to the data necessary to perform their functions and are required to protect your information.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or request deletion of your personal data at any time. To exercise these rights, contact us at support@arosoftlabs.com.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about this Privacy Policy, please contact us at support@arosoftlabs.com or write to AROSOFT Innovations Ltd, Kampala, Uganda.",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#F8FAFC] border-b border-slate-100 py-10 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <span className="inline-block mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 px-4 flex-1">
        <div className="container mx-auto max-w-2xl">
          <p className="text-slate-600 leading-relaxed mb-10">
            AROSOFT Labs is operated by AROSOFT Innovations Ltd ("we", "us", or "our"). We are committed to protecting your personal information. This
            Privacy Policy explains how we collect, use, and safeguard your data when you use our website and services.
          </p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={section.title} data-testid={`privacy-section-${index}`}>
                <h2 className="text-base font-semibold text-slate-900 mb-2">
                  {index + 1}. {section.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
