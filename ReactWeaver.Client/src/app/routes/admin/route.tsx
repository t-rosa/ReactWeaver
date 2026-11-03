import { AdminLayout } from "#src/components/layouts/admin-layout.tsx";
import { getCurrentUser, getGetCurrentUserQueryOptions } from "#src/lib/api/endpoints/index.ts";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);

    if (!user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }

    if (user && !user.roles.includes("Admin")) {
      redirect({
        to: "/",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.query({ ...getGetCurrentUserQueryOptions(), staleTime: "static" });
  },
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
