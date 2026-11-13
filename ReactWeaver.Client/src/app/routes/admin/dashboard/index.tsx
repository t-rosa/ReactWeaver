import { Header } from "#src/components/header.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import * as React from "react";
import { m } from "#src/paraglide/messages.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/dashboard/")({
  component: AdminDashboardRoute,
});

function AdminDashboardRoute() {
  return (
    <React.Fragment>
      <Header>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.nav_dashboard()}</BreadcrumbLink>
        </BreadcrumbItem>
      </Header>
    </React.Fragment>
  );
}
