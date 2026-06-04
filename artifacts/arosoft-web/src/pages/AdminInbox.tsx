import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      case "Urgent": return "text-red-700 bg-red-50 border-none font-bold";
      case "High": return "text-orange-700 bg-orange-50 border-none font-bold";
      case "Normal": return "text-blue-700 bg-blue-50 border-none font-bold";
      default: return "text-slate-600 bg-slate-100 border-none font-bold";
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case "New": return "bg-blue-600 text-white font-bold";
      case "Open": return "bg-yellow-100 text-yellow-800 font-bold border-none";
      case "Replied": return "bg-green-100 text-green-800 font-bold border-none";
      case "Closed": return "bg-slate-100 text-slate-500 font-bold border-none";
      default: return "bg-slate-100 text-slate-700 font-bold";
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
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-200 p-4 flex items-center justify-between shadow-sm z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Support Inbox</h1>
            <p className="text-sm text-slate-500 font-medium">Admin Mockup View</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-none font-bold">
              {messages.filter(m => m.status === "New").length} New
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-none font-bold">
              {messages.filter(m => m.status === "Open").length} Open
            </Badge>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Message List */}
          <div className="w-1/3 min-w-[320px] max-w-[400px] border-r border-gray-200 flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search messages..." className="pl-9 bg-slate-50 border-gray-200 focus-visible:ring-blue-500 shadow-sm" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setActiveMsgId(msg.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeMsgId === msg.id 
                      ? "bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/20" 
                      : "bg-transparent border-transparent hover:bg-slate-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-slate-900 truncate pr-2">{msg.name}</span>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{msg.date}</span>
                  </div>
                  <div className="text-sm font-medium mb-2 text-slate-700 truncate">{msg.subject}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${getStatusColor(msg.status)}`}>
                      {msg.status}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${getPriorityColor(msg.priority)}`}>
                      {msg.priority}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Message Detail */}
          <div className="flex-1 flex flex-col bg-white">
            {activeMsg ? (
              <>
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-white shadow-sm z-10">
                  <div>
                    <h2 className="text-2xl font-bold mb-4 text-slate-900">{activeMsg.subject}</h2>
                    <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-slate-400" /> <span className="text-slate-900 font-bold">{activeMsg.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-slate-400" /> <span>{activeMsg.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" /> <span>{activeMsg.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="border-gray-200 bg-slate-50 text-slate-700 font-medium">{activeMsg.reason}</Badge>
                    <Button variant="outline" size="sm" className="border-gray-200 bg-white text-slate-700 hover:bg-slate-50 font-medium" onClick={handleClose}>
                      Mark Closed
                    </Button>
                  </div>
                </div>

                {/* Thread */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  {/* Original Message */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 font-bold text-slate-600 text-sm">
                      {activeMsg.name.charAt(0)}
                    </div>
                    <div className="flex-1 bg-white border border-gray-200 p-5 rounded-2xl rounded-tl-none shadow-sm">
                      <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">{activeMsg.body}</p>
                    </div>
                  </div>

                  {/* Replies */}
                  {activeMsg.replies?.map((reply, i) => (
                    <div key={i} className="flex gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                        A
                      </div>
                      <div className="flex-1 bg-blue-50/50 border border-blue-100 p-5 rounded-2xl rounded-tr-none shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-blue-800">AROSOFT Admin</span>
                          <span className="text-xs font-medium text-blue-600/70">{reply.date}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">{reply.text}</p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-green-600 font-bold">
                          <CheckCircle2 size={14} /> Reply sent to client email
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Box */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="bg-slate-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
                    <Textarea 
                      placeholder="Type your reply here..." 
                      className="border-0 focus-visible:ring-0 resize-none min-h-[120px] bg-transparent p-4 text-slate-900"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-between items-center p-3 bg-slate-100 border-t border-gray-200">
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                        <CornerDownRight size={14} className="text-slate-400" /> Reply will be sent to <span className="text-slate-700">{activeMsg.email}</span>
                      </div>
                      <Button onClick={handleReply} disabled={!replyText.trim()} className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <AlertCircle size={48} className="mb-4 opacity-30 text-slate-400" />
                <p className="font-medium">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
