import { BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { AppHeader } from "./components/app-header";
import { AppInset } from "./components/app-inset";

export function AppDashboardView() {
  return (
    <AppInset>
      <AppHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
      </AppHeader>
    </AppInset>
  );
}
