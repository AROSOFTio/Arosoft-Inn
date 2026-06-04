import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { createActions, createPanels, createStats, videoMenu } from "@/components/dashboard/dashboardData";

export default function VideoDashboard() {
  return (
    <DashboardShell
      title="Video Editor Dashboard"
      description="Video tasks, uploads, revisions, and course media production."
      allowedRoles={["VIDEO_EDITOR"]}
      menuItems={videoMenu}
      stats={createStats(["Video tasks", "Uploads", "Revision requests", "Approved media"])}
      actions={createActions(["Upload video", "Review revisions", "Update edit status", "Publish media"])}
      panels={createPanels("Video tasks", "Uploads", "Revisions")}
    />
  );
}
