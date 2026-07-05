import { AdminDashboardView } from "@/modules/admin/admin-dashboard.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard/")({
  component: AdminDashboardView,
});
