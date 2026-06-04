import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, Mail, User, Clock, AlertCircle, CheckCircle2, CornerDownRight } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data
const mockMessages = [
  { id: 1, name: "Sarah Johnson", email: "sarah@edu-tech.com", subject: "School Management System Demo", reason: "Request a System", priority: "High", status: "New", date: "10 mins ago", body: "We are looking to implement a new school management system for our 3 campuses. We need to handle admissions, grading, and finance. Can we schedule a demo this week?" },
  { id: 2, name: "David K.", email: "david.k@gmail.com", subject: "Can't access Web Dev course", reason: "Academy Support", priority: "Urgent", status: "Open", date: "2 hours ago", body: "I paid for the Student Premium yesterday but when I try to access the Web Development course week 3, it says it's locked. Please help!" },
  { id: 3, name: "Acme Logistics", email: "procurement@acme.com", subject: "Invoice for SaaS template", reason: "Billing/Payment", priority: "Normal", status: "Replied", date: "1 day ago", body: "We bought the Admin Dashboard template but need an official tax invoice sent to our finance department.", replies: [{ text: "Hello, I have attached the tax invoice to this email. Let me know if you need anything else.", date: "12 hours ago", by: "Admin" }] },
  { id: 4, name: "Tech Solutions Inc", email: "hello@techsol.com", subject: "Custom AI Workflow", reason: "General Inquiry", priority: "Normal", status: "Closed", date: "3 days ago", body: "Do you guys build custom CRAG setups for legal document parsing?" },
];

export default function AdminInbox() {
  const [messages, setMessages] = useState(mockMessages);
  const [activeMsgId, setActiveMsgId] = useState<number | null>(1);
  const [replyText, setReplyText] = useState("");

  const activeMsg = messages.find(m => m.id === activeMsgId);

  const getPriorityColor = (p: string) => {
    switch(p) {
      case "Urgent": return "text-destructive border-destructive/30 bg-destructive/10";
      case "High": return "text-orange-500 border-orange-500/30 bg-orange-500/10";
      case "Normal": return "text-blue-500 border-blue-500/30 bg-blue-500/10";
      default: return "text-muted-foreground border-white/10 bg-white/5";
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case "New": return "bg-primary text-primary-foreground";
      case "Open": return "bg-yellow-500/20 text-yellow-500";
      case "Replied": return "bg-green-500/20 text-green-500";
      case "Closed": return "bg-white/10 text-muted-foreground";
      default: return "bg-white/10 text-white";
    }
  };

  const handleReply = () => {
    if (!replyText.trim() || !activeMsgId) return;
    
    setMessages(msgs => msgs.map(m => {
      if (m.id === activeMsgId) {
        return {
          ...m,
          status: "Replied",
          replies: [...(m.replies || []), { text: replyText, date: "Just now", by: "Admin" }]
        };
      }
      return m;
    }));
    
    setReplyText("");
  };

  const handleClose = () => {
    if (!activeMsgId) return;
    setMessages(msgs => msgs.map(m => m.id === activeMsgId ? { ...m, status: "Closed" } : m));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        <div className="bg-[#0A1220] border-b border-white/10 p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Support Inbox</h1>
            <p className="text-sm text-muted-foreground">Admin Mockup View</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {messages.filter(m => m.status === "New").length} New
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              {messages.filter(m => m.status === "Open").length} Open
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Message List */}
          <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-white/10 flex flex-col bg-card/20">
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-9 bg-white/5 border-white/10" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setActiveMsgId(msg.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeMsgId === msg.id 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-transparent border-transparent hover:bg-white/5"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm truncate pr-2">{msg.name}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.date}</span>
                  </div>
                  <div className="text-sm font-medium mb-1 truncate">{msg.subject}</div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border-none ${getStatusColor(msg.status)}`}>
                      {msg.status}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(msg.priority)}`}>
                      {msg.priority}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Message Detail */}
          <div className="flex-1 flex flex-col bg-[#050816]">
            {activeMsg ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-start bg-card/30">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{activeMsg.subject}</h2>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User size={16} /> <span className="text-foreground">{activeMsg.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} /> <span>{activeMsg.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} /> <span>{activeMsg.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-white/10">{activeMsg.reason}</Badge>
                    <Button variant="outline" size="sm" className="border-white/10 bg-white/5" onClick={handleClose}>
                      Mark Closed
                    </Button>
                  </div>
                </div>

                {/* Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Original Message */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {activeMsg.name.charAt(0)}
                    </div>
                    <div className="flex-1 bg-card/50 border border-white/5 p-5 rounded-2xl rounded-tl-none">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{activeMsg.body}</p>
                    </div>
                  </div>

                  {/* Replies */}
                  {activeMsg.replies?.map((reply, i) => (
                    <div key={i} className="flex gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        A
                      </div>
                      <div className="flex-1 bg-primary/10 border border-primary/20 p-5 rounded-2xl rounded-tr-none">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-primary">AROSOFT Admin</span>
                          <span className="text-xs text-primary/60">{reply.date}</span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.text}</p>
                        <div className="mt-3 flex items-center gap-1 text-xs text-green-500 font-medium">
                          <CheckCircle2 size={14} /> Sent to client email
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="p-4 border-t border-white/10 bg-card/30">
                  <div className="bg-background border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
                    <Textarea 
                      placeholder="Type your reply here..." 
                      className="border-0 focus-visible:ring-0 resize-none min-h-[120px] bg-transparent p-4"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-between items-center p-3 bg-white/5 border-t border-white/5">
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <CornerDownRight size={14} /> Reply will be sent to {activeMsg.email}
                      </div>
                      <Button onClick={handleReply} disabled={!replyText.trim()}>
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}