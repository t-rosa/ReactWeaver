import { Container } from "#src/components/container.tsx";
import { DashboardHeader } from "#src/components/layouts/dashboard-header.tsx";
import { DashboardInset } from "#src/components/layouts/dashboard-inset.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { UserProfile } from "#src/features/users/components/user-profile.tsx";
import { m } from "#src/paraglide/messages.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/profile/")({
  component: UserProfileRoute,
});

function UserProfileRoute() {
  return (
    <DashboardInset>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.nav_profile()}</BreadcrumbLink>
        </BreadcrumbItem>
      </DashboardHeader>
      <Container>
        <UserProfile />
      </Container>
    </DashboardInset>
  );
}
