import { Container } from "#src/components/container.tsx";
import { Header } from "#src/components/header.tsx";
import { ProfileLayout } from "#src/components/layouts/profile-layout.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { UserProfile } from "#src/features/users/components/user-profile.tsx";
import { getCurrentUser } from "#src/lib/api/endpoints/index.ts";
import { m } from "#src/lib/i18n/paraglide/messages.js";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <ProfileLayout>
      <Header>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.nav_profile()}</BreadcrumbLink>
        </BreadcrumbItem>
      </Header>
      <Container>
        <UserProfile />
      </Container>
    </ProfileLayout>
  );
}
