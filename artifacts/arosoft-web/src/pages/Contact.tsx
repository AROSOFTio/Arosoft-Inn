import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24">
              
              {/* Left Column - Contact Info */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">
                    Talk to AROSOFT
                  </h1>
                  <p className="text-lg text-slate-600">
                    Have a project in mind, need technical support, or want to explore our academy? We're here to help.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                      <Mail size={20} />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>hello@arosof.com (General)</p>
                        <p>support@arosof.com (Support)</p>
                        <p>projects@arosof.com (Projects)</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0 border border-violet-100">
                      <Phone size={20} />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                      <p className="text-sm text-slate-600">+256 XXX XXX XXX</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Mon - Sat, 9am - 6pm EAT</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 border border-slate-200">
                      <MapPin size={20} />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-slate-900 mb-1">Location</h4>
                      <p className="text-sm text-slate-600">Kampala, Uganda</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="flex gap-3 text-sm text-slate-600 items-start">
                    <MessageSquare size={18} className="shrink-0 text-blue-600 mt-0.5" />
                    <p className="font-medium">All submitted messages are routed directly to our secure internal support inbox for fast triage and response.</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-3">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  {isSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 space-y-6">
                      <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100">
                        <CheckCircle2 size={40} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 text-slate-900">Message Received</h3>
                        <p className="text-slate-600 max-w-md mx-auto">
                          Thank you. Your message has been received. Our support team will respond to your email shortly.
                        </p>
                      </div>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="border-slate-200 text-slate-900 font-medium">
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
                                <FormLabel className="text-slate-900 font-bold">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" className="bg-slate-50 border-gray-200 focus-visible:ring-blue-500" {...field} />
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
                                <FormLabel className="text-slate-900 font-bold">Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="john@example.com" type="email" className="bg-slate-50 border-gray-200 focus-visible:ring-blue-500" {...field} />
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
                                <FormLabel className="text-slate-900 font-bold">Phone Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="+256..." className="bg-slate-50 border-gray-200 focus-visible:ring-blue-500" {...field} />
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
                                <FormLabel className="text-slate-900 font-bold">Organization / School</FormLabel>
                                <FormControl>
                                  <Input placeholder="Acme Corp" className="bg-slate-50 border-gray-200 focus-visible:ring-blue-500" {...field} />
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
                                <FormLabel className="text-slate-900 font-bold">Reason for Contact</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-slate-50 border-gray-200 focus-visible:ring-blue-500">
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
                                <FormLabel className="text-slate-900 font-bold">Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="bg-slate-50 border-gray-200 focus-visible:ring-blue-500">
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
                              <FormLabel className="text-slate-900 font-bold">Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="Brief summary of your request" className="bg-slate-50 border-gray-200 focus-visible:ring-blue-500" {...field} />
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
                              <FormLabel className="text-slate-900 font-bold">Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide as much detail as possible..." 
                                  className="min-h-[150px] bg-slate-50 border-gray-200 resize-none focus-visible:ring-blue-500" 
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
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-lg bg-slate-50 shadow-sm">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-blue-600 mt-1 border-gray-300"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  I agree that AROSOFT Innovations may contact me about this request and store my details according to their privacy policy.
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <Button type="submit" size="lg" className="w-full text-base h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">
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
