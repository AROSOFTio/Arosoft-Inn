import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050816] py-14 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand column */}
        <div className="md:col-span-2">
          <Link href="/" className="flex flex-col leading-none mb-4" data-testid="footer-logo">
            <span className="text-[16px] font-bold tracking-tight text-white">AROSOFT</span>
            <span className="text-[10px] font-medium tracking-widest text-primary uppercase mt-0.5">Innovations Ltd</span>
          </Link>
          <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-5">
            Building digital systems, premium templates, AI-powered learning, and workflow tools for serious teams.
          </p>
          <div className="space-y-1.5 text-sm text-slate-400 mb-5">
            <p className="flex items-center gap-2">
              <MapPin size={13} className="text-slate-500 shrink-0" />
              Kampala, Uganda
            </p>
            <p className="flex items-center gap-2">
              <Mail size={13} className="text-slate-500 shrink-0" />
              hello@arosof.com
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="Facebook" data-testid="footer-social-facebook">
              <Facebook size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="Twitter" data-testid="footer-social-twitter">
              <Twitter size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="LinkedIn" data-testid="footer-social-linkedin">
              <Linkedin size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors" aria-label="Instagram" data-testid="footer-social-instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Products</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link href="/systems" className="hover:text-white transition-colors">Custom Systems</Link></li>
            <li><Link href="/scripts" className="hover:text-white transition-colors">Script Templates</Link></li>
            <li><Link href="/academy" className="hover:text-white transition-colors">Academy</Link></li>
            <li><Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Client Login</Link></li>
            <li><Link href="/dashboard-preview" className="hover:text-white transition-colors">Dashboard Preview</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Legal</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} AROSOFT Innovations Ltd. All rights reserved.</p>
        <p>Kampala, Uganda &mdash; Monday &ndash; Saturday</p>
      </div>
    </footer>
  );
}
