import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 py-12 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              AROSOFT <span className="text-primary font-normal">Innovations</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
            Building digital systems, premium templates, AI-powered learning, and workflow tools for serious teams and learners.
          </p>
          <div className="text-sm text-muted-foreground">
            <p>Kampala, Uganda</p>
            <p className="mt-1">hello@arosof.com</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-foreground mb-4">Products</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/systems" className="hover:text-primary transition-colors">Custom Systems</Link></li>
            <li><Link href="/scripts" className="hover:text-primary transition-colors">Script Templates</Link></li>
            <li><Link href="/academy" className="hover:text-primary transition-colors">Academy</Link></li>
            <li><Link href="/workflows" className="hover:text-primary transition-colors">Workflows</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/login" className="hover:text-primary transition-colors">Client Login</Link></li>
            <li><Link href="/admin/inbox" className="hover:text-primary transition-colors">Admin Mock</Link></li>
            <li><Link href="/dashboard-preview" className="hover:text-primary transition-colors">Dashboard Preview</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto mt-12 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AROSOFT Innovations. All rights reserved.</p>
      </div>
    </footer>
  );
}
