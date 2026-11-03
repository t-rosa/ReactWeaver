import { DashboardHeader } from "#src/components/layouts/dashboard-header.tsx";
import { DashboardInset } from "#src/components/layouts/dashboard-inset.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { m } from "#src/paraglide/messages.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard/")({
  component: AdminDashboardRoute,
});

function AdminDashboardRoute() {
  return (
    <DashboardInset>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.nav_dashboard()}</BreadcrumbLink>
        </BreadcrumbItem>
      </DashboardHeader>
    </DashboardInset>
  );
}
