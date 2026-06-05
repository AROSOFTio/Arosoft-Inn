import { FormEvent, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Bot, Mail, MessageCircle, Phone, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "assistant" | "user";
  text: string;
}

const publicPaths = ["/", "/systems", "/scripts", "/academy", "/portfolio", "/contact"];

function isPublicWidgetPath(path: string) {
  return publicPaths.some((allowed) => path === allowed || (allowed !== "/" && path.startsWith(`${allowed}/`)));
}

export function ChatbotWidget() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi. Ask about AROSOFT Labs systems, websites, scripts, academy courses, portfolio, or support." },
  ]);
  const [handoff, setHandoff] = useState(false);
  const [notice, setNotice] = useState("");
  const visible = useMemo(() => isPublicWidgetPath(location), [location]);

  if (!visible) return null;

  async function ask(event: FormEvent) {
    event.preventDefault();
    const text = query.trim();
    if (!text) return;

    setMessages((current) => [...current, { role: "user", text }]);
    setQuery("");

    const response = await fetch("/api/assistant/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text }),
    });
    const data = (await response.json()) as { reply?: string; handoff?: boolean; message?: string };
    setMessages((current) => [...current, { role: "assistant", text: data.reply ?? data.message ?? "I could not answer that yet." }]);
    setHandoff(Boolean(data.handoff));
  }

  async function submitLead() {
    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.text;
    const response = await fetch("/api/assistant/support-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: leadEmail || undefined,
        subject: "Chatbot support request",
        message: latestUserMessage || "Visitor requested support from chatbot.",
      }),
    });

    setNotice(response.ok ? "Support ticket created." : "Unable to create support ticket.");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm rounded-lg border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-blue-50 p-2 text-blue-600"><Bot size={18} /></div>
              <div>
                <p className="text-sm font-bold text-slate-950">AROSOFT Labs Assistant</p>
                <p className="text-xs text-slate-500">Quick help and support handoff</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 text-slate-500 hover:bg-slate-100" aria-label="Close assistant">
              <X size={17} />
            </button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`rounded-lg px-3 py-2 text-sm ${message.role === "user" ? "ml-8 bg-blue-600 text-white" : "mr-8 bg-slate-50 text-slate-700"}`}>
                {message.text}
              </div>
            ))}
            {handoff && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-slate-700">
                <p className="font-semibold text-blue-700">Human handoff</p>
                <div className="mt-2 grid gap-2">
                  <a href="tel:+000000000" className="flex items-center gap-2"><Phone size={14} /> Call phone placeholder</a>
                  <a href="https://wa.me/000000000" target="_blank" rel="noreferrer" className="flex items-center gap-2"><MessageCircle size={14} /> WhatsApp placeholder</a>
                  <a href="mailto:support@arosoftlabs.com" className="flex items-center gap-2"><Mail size={14} /> Email support</a>
                </div>
                <div className="mt-3 flex gap-2">
                  <Input value={leadEmail} onChange={(event) => setLeadEmail(event.target.value)} placeholder="Email optional" className="h-8 bg-white" />
                  <Button type="button" size="sm" onClick={submitLead}>Ticket</Button>
                </div>
                {notice && <p className="mt-2 text-blue-700">{notice}</p>}
              </div>
            )}
          </div>
          <form onSubmit={ask} className="flex gap-2 border-t border-slate-100 p-3">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ask a question..." className="bg-white" />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" aria-label="Send message"><Send size={16} /></Button>
          </form>
        </div>
      )}
      <Button type="button" onClick={() => setOpen((current) => !current)} className="h-12 w-12 rounded-full bg-blue-600 p-0 text-white shadow-lg hover:bg-blue-700" aria-label="Open assistant">
        <MessageCircle size={22} />
      </Button>
    </div>
  );
}
