import { db, contactMessagesTable } from "@workspace/db";

export const companyKnowledge = [
  "AROSOFT Labs sells and builds business systems, websites, script templates, academy courses, portfolio projects, and monthly support.",
  "Public navigation is Home, Systems, Scripts, Academy, Portfolio, Contact, Login, and Get Started.",
  "Clients can request systems, scripts, websites, academy help, video production, branding, marketing, consultation, and other digital services.",
  "Support handoff is available by phone, WhatsApp, email, or support ticket.",
];

export const courseKnowledge = [
  "Academy courses can be free or premium. Free courses allow student enrollment now; premium courses use manual payment requests before access is confirmed.",
  "Students can view enrolled courses in My Learning, open lessons, take quizzes, complete assignments, and track progress.",
  "The learning assistant uses fixed company and course knowledge first, then local course context when available.",
];

export const systemsKnowledge = [
  "Systems are published by admins and shown on the public Systems page.",
  "Request Quote actions should take clients into the request flow where requirements, budget, timeline, and attachments can be submitted.",
  "Featured systems can appear on the homepage after admin publishing.",
];

export const scriptsKnowledge = [
  "Scripts and templates are published by admins and shown on the public Scripts marketplace.",
  "Templates can start from $5 and include preview/download fields.",
  "Buy Now creates a manual payment request with MTN MoMo, Airtel Money, Bank Transfer, or Request Invoice.",
];

export const faqKnowledge = [
  "If a visitor needs a custom quote, they should submit a contact message or client request.",
  "If SMTP is not configured, support replies are saved internally and email sending is skipped safely.",
  "CAG means fixed company/course knowledge. RAG is local content retrieval. CRAG is a confidence check before answering or handing off.",
];

const allKnowledge = [
  ...companyKnowledge,
  ...courseKnowledge,
  ...systemsKnowledge,
  ...scriptsKnowledge,
  ...faqKnowledge,
];

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

export function searchKnowledge(query: string) {
  const queryTokens = new Set(tokenize(query));

  return allKnowledge
    .map((entry) => {
      const entryTokens = tokenize(entry);
      const score = entryTokens.filter((token) => queryTokens.has(token)).length;
      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.entry);
}

export function estimateConfidence(query: string, context: string[]) {
  if (!query.trim() || context.length === 0) return 0.15;
  const queryTokens = tokenize(query);
  const contextTokens = new Set(tokenize(context.join(" ")));
  const matches = queryTokens.filter((token) => contextTokens.has(token)).length;
  return Math.min(0.95, Math.max(0.25, matches / Math.max(queryTokens.length, 1)));
}

export function shouldHandoffToHuman(query: string, confidence: number) {
  const lower = query.toLowerCase();
  return confidence < 0.35 || ["call", "whatsapp", "human", "urgent", "price", "quote", "invoice"].some((word) => lower.includes(word));
}

export function generateAssistantReply(query: string, context: string[]) {
  const confidence = estimateConfidence(query, context);
  const handoff = shouldHandoffToHuman(query, confidence);

  if (!context.length) {
    return {
      reply: "I do not have enough local knowledge to answer that clearly yet. Please share one more detail, or I can help you send this to support.",
      confidence,
      handoff: true,
    };
  }

  const answer = context.slice(0, 3).join(" ");
  return {
    reply: handoff
      ? `${answer} If you want a confirmed answer or quote, I can hand this to support by phone, WhatsApp, email, or support ticket.`
      : answer,
    confidence,
    handoff,
  };
}

export async function createSupportLeadFromChat(data: {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const [message] = await db
    .insert(contactMessagesTable)
    .values({
      fullName: data.fullName?.trim() || "Chatbot Visitor",
      email: data.email?.trim().toLowerCase() || "support@arosoftlabs.com",
      phone: data.phone?.trim() || null,
      organization: null,
      reason: "Chatbot support lead",
      priority: "Normal",
      subject: data.subject?.trim() || "Chatbot support handoff",
      message: data.message,
      attachmentUrl: null,
      status: "NEW",
      source: "CHATBOT",
    })
    .returning();

  return message;
}
