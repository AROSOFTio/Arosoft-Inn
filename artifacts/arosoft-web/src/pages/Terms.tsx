import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
        <section className="bg-slate-50 border-b border-slate-100 py-10 px-4">
          <div className="container mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Legal</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="mt-3 text-slate-600">
              These terms explain how AROSOFT Innovations provides websites, systems, scripts, academy support, and related services.
            </p>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="container mx-auto max-w-4xl space-y-6 text-sm leading-7 text-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-950 mb-2">Service Requests</h2>
              <p>
                Requests submitted through the platform are reviewed by AROSOFT staff before work begins. Quotes, timelines, and project scope are confirmed before delivery starts.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 mb-2">Templates and Scripts</h2>
              <p>
                Published templates and scripts are offered for implementation support, customization, or later payment integration. Download and payment automation will be added in a future sprint.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 mb-2">Accounts and Dashboards</h2>
              <p>
                Internal dashboards are role protected. Users must keep their login details private and use the platform only for authorized work.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950 mb-2">Contact</h2>
              <p>
                For questions about these terms, contact AROSOFT Innovations at hello@arosoft.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
