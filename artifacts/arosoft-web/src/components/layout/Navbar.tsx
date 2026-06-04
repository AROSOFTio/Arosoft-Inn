import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/systems", label: "Systems" },
  { href: "/scripts", label: "Scripts" },
  { href: "/academy", label: "Academy" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

const utilityLinks = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact Us" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top utility bar */}
      <div className="w-full border-b border-slate-100 bg-[#F8FAFC]">
        <div className="container mx-auto flex h-8 items-center justify-between px-4 md:px-6">
          <a
            href="mailto:hello@arosoft.com"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
            data-testid="utility-email"
          >
            <Mail size={11} />
            hello@arosoft.com
          </a>
          <div className="flex items-center gap-4 ml-auto">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                data-testid={`utility-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Facebook"
                data-testid="social-facebook"
              >
                <Facebook size={13} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="X / Twitter"
                data-testid="social-twitter"
              >
                <Twitter size={13} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="LinkedIn"
                data-testid="social-linkedin"
              >
                <Linkedin size={13} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Instagram"
                data-testid="social-instagram"
              >
                <Instagram size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" data-testid="nav-logo">
            <div className="flex flex-col leading-none">
              <span className="text-[15px] font-bold tracking-tight text-slate-900">AROSOFT</span>
              <span className="text-[10px] font-medium tracking-widest text-primary uppercase">Innovations</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  location === link.href
                    ? "text-primary font-medium bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                data-testid="nav-login"
              >
                Login
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="sm"
                className="bg-primary hover:bg-blue-700 text-white"
                data-testid="nav-get-started"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-600 rounded-md hover:bg-slate-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            data-testid="nav-mobile-toggle"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4">
            <div className="flex flex-col space-y-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    location === link.href
                      ? "text-primary font-medium bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 mt-2">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-slate-200 text-slate-900">
                    Login
                  </Button>
                </Link>
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full bg-primary hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
              {/* Mobile utility links */}
              <div className="pt-3 border-t border-slate-100 flex gap-4 flex-wrap mt-1">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
