import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { m } from "#src/paraglide/messages.js";
import { AdminHeader } from "./components/admin-header";
import { AdminInset } from "./components/admin-inset";

export function AdminDashboardView() {
  return (
    <AdminInset>
      <AdminHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.nav_dashboard()}</BreadcrumbLink>
        </BreadcrumbItem>
      </AdminHeader>
    </AdminInset>
  );
}
