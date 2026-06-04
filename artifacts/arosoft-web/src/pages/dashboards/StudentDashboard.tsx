import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createActions, createPanels, createStats, studentMenu } from "@/components/dashboard/dashboardData";

export default function StudentDashboard() {
  return (
    <DashboardShell
      title="Student Dashboard"
      description="Courses, learning tasks, progress tracking, quizzes, assignments, and AI support."
      allowedRoles={["STUDENT"]}
      menuItems={studentMenu}
      stats={createStats(["Active courses", "Learning tasks", "Progress score", "AI support chats"])}
      actions={createActions(["Continue course", "Submit assignment", "Take quiz", "Ask AI support"])}
      panels={createPanels("Courses", "Learning tasks", "Progress")}
    />
  );
}
