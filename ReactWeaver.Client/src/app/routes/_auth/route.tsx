import { AuthLayout } from "#src/components/layouts/auth-layout.tsx";
import { getCurrentUser } from "#src/lib/api/endpoints/index.ts";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);
    if (user) {
      redirect({ to: "/app/dashboard", throw: true });
    }
  },
  component: AuthRoute,
});

function AuthRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
