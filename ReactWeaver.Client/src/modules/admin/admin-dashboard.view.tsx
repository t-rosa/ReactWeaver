import { BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { AdminHeader } from "./components/admin-header";
import { AdminInset } from "./components/admin-inset";

export function AdminDashboardView() {
  return (
    <AdminInset>
      <AdminHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
      </AdminHeader>
    </AdminInset>
  );
}
