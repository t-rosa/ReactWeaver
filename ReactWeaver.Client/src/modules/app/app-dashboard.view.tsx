import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { m } from "#src/paraglide/messages.js";
import { AppHeader } from "./components/app-header";
import { AppInset } from "./components/app-inset";

export function AppDashboardView() {
  return (
    <AppInset>
      <AppHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.nav_dashboard()}</BreadcrumbLink>
        </BreadcrumbItem>
      </AppHeader>
    </AppInset>
  );
}
