import {
  Archive,
  BookOpen,
  BriefcaseBusiness,
  ClipboardCheck,
  Code2,
  CreditCard,
  FileArchive,
  FileCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
  Video,
} from "lucide-react";
import type {
  DashboardAction,
  DashboardMenuItem,
  DashboardPanel,
  DashboardStat,
} from "@/components/dashboard/DashboardShell";

export const adminMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Requests", icon: Inbox, href: "/admin/requests" },
  { label: "Projects", icon: BriefcaseBusiness, href: "/admin/projects" },
  { label: "Tasks", icon: ClipboardCheck, href: "/admin/tasks" },
  { label: "Team", icon: Users, href: "/admin" },
  { label: "Support Inbox", icon: MessageSquare, href: "/support/messages" },
  { label: "Systems", icon: Archive, href: "/admin/systems" },
  { label: "Scripts", icon: Code2, href: "/admin" },
  { label: "Courses", icon: GraduationCap, href: "/admin" },
  { label: "Portfolio", icon: FileArchive, href: "/admin" },
  { label: "Invoices", icon: CreditCard, href: "/admin" },
  { label: "Compliance", icon: ShieldCheck, href: "/admin" },
  { label: "Settings", icon: Settings, href: "/admin" },
];

export const developerMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/developer" },
  { label: "My Tasks", icon: ClipboardCheck, href: "/developer/tasks" },
  { label: "Projects", icon: BriefcaseBusiness, href: "/developer/tasks" },
  { label: "Files", icon: FileArchive, href: "/developer/tasks" },
  { label: "Comments", icon: MessageSquare, href: "/developer/tasks" },
];

export const studentMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/student" },
  { label: "Courses", icon: GraduationCap, href: "/student" },
  { label: "My Learning", icon: BookOpen, href: "/student" },
  { label: "Quizzes", icon: ClipboardCheck, href: "/student" },
  { label: "Assignments", icon: FileText, href: "/student" },
  { label: "Progress", icon: Archive, href: "/student" },
  { label: "AI Support", icon: HelpCircle, href: "/student" },
];

export const clientMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/client" },
  { label: "Requests", icon: Inbox, href: "/client/requests" },
  { label: "Projects", icon: BriefcaseBusiness, href: "/client/projects" },
  { label: "Invoices", icon: CreditCard, href: "/client" },
  { label: "Support", icon: MessageSquare, href: "/contact" },
];

export const supportMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/support" },
  { label: "Inbox", icon: Inbox, href: "/support/messages" },
  { label: "Tickets", icon: ClipboardCheck, href: "/support/tasks" },
  { label: "Replies", icon: MessageSquare, href: "/support/messages" },
];

export const financeMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/finance" },
  { label: "Invoices", icon: CreditCard, href: "/finance/tasks" },
  { label: "Payments", icon: FileCheck, href: "/finance/tasks" },
  { label: "Receipts", icon: Receipt, href: "/finance/tasks" },
];

export const complianceMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/compliance" },
  { label: "Tax Records", icon: FileText, href: "/compliance/tasks" },
  { label: "Contracts", icon: FileCheck, href: "/compliance/tasks" },
  { label: "Company Documents", icon: FileArchive, href: "/compliance/tasks" },
  { label: "Audit Logs", icon: ShieldCheck, href: "/compliance/tasks" },
];

export const marketingMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/marketing" },
  { label: "Marketing Tasks", icon: ClipboardCheck, href: "/marketing/tasks" },
  { label: "Campaigns", icon: Megaphone, href: "/marketing/tasks" },
  { label: "Content Plans", icon: FileText, href: "/marketing/tasks" },
];

export const videoMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/video" },
  { label: "Video Tasks", icon: Video, href: "/video/tasks" },
  { label: "Uploads", icon: FileArchive, href: "/video/tasks" },
  { label: "Revisions", icon: MessageSquare, href: "/video/tasks" },
];

export const adminStats: DashboardStat[] = [
  { label: "Total client requests", value: "42", detail: "8 new requests this week" },
  { label: "Active projects", value: "16", detail: "5 waiting on client feedback" },
  { label: "Pending tasks", value: "73", detail: "18 marked high priority" },
  { label: "Open support tickets", value: "11", detail: "3 need same-day response" },
  { label: "Student enrollments", value: "128", detail: "14 new academy learners" },
  { label: "Recent activity", value: "29", detail: "Updates across projects and support" },
];

export function createStats(labels: string[]): DashboardStat[] {
  return labels.map((label, index) => ({
    label,
    value: String([12, 7, 24, 5][index % 4]),
    detail: "Sprint 2 placeholder metric ready for live data",
  }));
}

export function createActions(labels: string[]): DashboardAction[] {
  return labels.map((label) => ({
    label,
    description: "Open the workspace area and continue the next tracked item.",
    href: getActionHref(label),
  }));
}

function getActionHref(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("review client requests")) return "/admin/requests";
  if (normalized.includes("client request") || normalized.includes("create request")) return "/client/requests";
  if (normalized.includes("project task") || normalized.includes("assign")) return "/admin/tasks";
  if (normalized.includes("support inbox") || normalized.includes("inbox") || normalized.includes("reply")) return "/support/messages";
  if (normalized.includes("task")) return "/staff/tasks";
  if (normalized.includes("project")) return "/client/projects";

  return undefined;
}

export function createPanels(primary: string, secondary: string, tertiary: string): DashboardPanel[] {
  return [
    {
      title: "Recent Activity",
      items: [
        `${primary} updated this morning`,
        `${secondary} needs review`,
        `${tertiary} moved to active status`,
      ],
    },
    {
      title: primary,
      items: [`Review ${primary.toLowerCase()}`, `Assign owner`, `Confirm next milestone`],
    },
    {
      title: secondary,
      items: [`Check ${secondary.toLowerCase()}`, `Add internal note`, `Send status update`],
    },
  ];
}
