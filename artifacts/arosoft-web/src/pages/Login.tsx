import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { KeyRound, Mail } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-xl relative z-10 rounded-2xl">
          <CardHeader className="space-y-3 text-center pb-6 pt-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
              <KeyRound size={28} />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600 text-sm font-medium px-4">
              Access your client portal, academy dashboard, project workspace, or admin tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-900 font-bold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="email" type="email" placeholder="name@company.com" className="pl-10 h-12 bg-slate-50 border-gray-200 focus-visible:ring-blue-500 shadow-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-900 font-bold">Password</Label>
                  <Link href="/forgot-password" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-12 bg-slate-50 border-gray-200 focus-visible:ring-blue-500 shadow-sm" />
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2">
                <Checkbox id="remember" className="border-gray-300 data-[state=checked]:bg-blue-600 w-5 h-5 rounded" />
                <Label htmlFor="remember" className="text-sm font-medium text-slate-700 cursor-pointer">Remember me for 30 days</Label>
              </div>
            </div>
            
            <Button className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm">Sign In</Button>
            
            <div className="text-center text-sm font-medium text-slate-600 pt-4 border-t border-gray-100">
              Don't have an account? <Link href="/contact" className="text-blue-600 font-bold hover:underline ml-1">Get Started</Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
