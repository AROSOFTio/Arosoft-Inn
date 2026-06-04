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
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Requests", icon: Inbox },
  { label: "Projects", icon: BriefcaseBusiness },
  { label: "Tasks", icon: ClipboardCheck },
  { label: "Team", icon: Users },
  { label: "Support Inbox", icon: MessageSquare },
  { label: "Systems", icon: Archive },
  { label: "Scripts", icon: Code2 },
  { label: "Courses", icon: GraduationCap },
  { label: "Portfolio", icon: FileArchive },
  { label: "Invoices", icon: CreditCard },
  { label: "Compliance", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
];

export const developerMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Tasks", icon: ClipboardCheck },
  { label: "Projects", icon: BriefcaseBusiness },
  { label: "Files", icon: FileArchive },
  { label: "Comments", icon: MessageSquare },
];

export const studentMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Courses", icon: GraduationCap },
  { label: "My Learning", icon: BookOpen },
  { label: "Quizzes", icon: ClipboardCheck },
  { label: "Assignments", icon: FileText },
  { label: "Progress", icon: Archive },
  { label: "AI Support", icon: HelpCircle },
];

export const clientMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Requests", icon: Inbox },
  { label: "Projects", icon: BriefcaseBusiness },
  { label: "Invoices", icon: CreditCard },
  { label: "Support", icon: MessageSquare },
];

export const supportMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Inbox", icon: Inbox },
  { label: "Tickets", icon: ClipboardCheck },
  { label: "Replies", icon: MessageSquare },
];

export const financeMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Invoices", icon: CreditCard },
  { label: "Payments", icon: FileCheck },
  { label: "Receipts", icon: Receipt },
];

export const complianceMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Tax Records", icon: FileText },
  { label: "Contracts", icon: FileCheck },
  { label: "Company Documents", icon: FileArchive },
  { label: "Audit Logs", icon: ShieldCheck },
];

export const marketingMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Marketing Tasks", icon: ClipboardCheck },
  { label: "Campaigns", icon: Megaphone },
  { label: "Content Plans", icon: FileText },
];

export const videoMenu: DashboardMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Video Tasks", icon: Video },
  { label: "Uploads", icon: FileArchive },
  { label: "Revisions", icon: MessageSquare },
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
  }));
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
