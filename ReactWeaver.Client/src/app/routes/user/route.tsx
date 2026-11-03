import { UserLayout } from "#src/components/layouts/user-layout.tsx";
import { getCurrentUser } from "#src/lib/api/endpoints/index.ts";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/user")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  component: UserRoute,
});

function UserRoute() {
  return (
    <UserLayout>
      <Outlet />
    </UserLayout>
  );
}
