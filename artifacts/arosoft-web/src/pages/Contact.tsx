import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, MapPin, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  reason: z.string().min(1, "Please select a reason"),
  priority: z.string().min(1, "Please select priority"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine(val => val === true, "You must agree to be contacted"),
});

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      reason: "",
      priority: "Normal",
      subject: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    console.log("Form submitted:", data);
    // Here we would typically send to backend
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24">
              
              {/* Left Column - Contact Info */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Talk to AROSOFT Innovations
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Have a project in mind, need technical support, or want to explore our academy? We're here to help.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email Us</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>hello@arosof.com (General)</p>
                        <p>support@arosof.com (Support)</p>
                        <p>projects@arosof.com (Projects)</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Call Us</h4>
                      <p className="text-sm text-muted-foreground">+256 XXX XXX XXX</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon - Sat, 9am - 6pm EAT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Location</h4>
                      <p className="text-sm text-muted-foreground">Kampala, Uganda</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card/50 border border-white/5 rounded-xl p-5">
                  <div className="flex gap-3 text-sm text-muted-foreground items-start">
                    <MessageSquare size={18} className="shrink-0 text-primary mt-0.5" />
                    <p>All submitted messages are routed directly to our secure internal support inbox for fast triage and response.</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-3">
                <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 space-y-6">
                      <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={40} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Message Received</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Thank you. Your message has been received. Our support team will respond to your email shortly.
                        </p>
                      </div>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline">
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" className="bg-background/50 border-white/10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" type="email" className="bg-background/50 border-white/10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+256..." className="bg-background/50 border-white/10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="organization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organization / School</FormLabel>
                                <FormControl>
                                  <Input placeholder="Acme Corp" className="bg-background/50 border-white/10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Reason for Contact</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-background/50 border-white/10">
                                      <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                    <SelectItem value="Request a Website">Request a Website</SelectItem>
                                    <SelectItem value="Request a System">Request a System</SelectItem>
                                    <SelectItem value="Buy Script Template">Buy Script Template</SelectItem>
                                    <SelectItem value="Academy Support">Academy Support</SelectItem>
                                    <SelectItem value="Premium Course Access">Premium Course Access</SelectItem>
                                    <SelectItem value="Partnership">Partnership</SelectItem>
                                    <SelectItem value="Billing/Payment">Billing/Payment</SelectItem>
                                    <SelectItem value="Technical Support">Technical Support</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-background/50 border-white/10">
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Brief summary of your request" className="bg-background/50 border-white/10" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide as much detail as possible..." 
                                  className="min-h-[150px] bg-background/50 border-white/10 resize-none" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-white/5 rounded-lg bg-background/20">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-primary mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-normal text-muted-foreground">
                                  I agree that AROSOFT Innovations may contact me about this request and store my details according to their privacy policy.
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button type="submit" size="lg" className="w-full text-base h-12">
                          Send Message
                        </Button>
                      </form>
                    </Form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}