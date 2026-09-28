import { AppDashboardView } from "#src/modules/app/app-dashboard.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/dashboard/")({
  component: AppDashboardView,
});
