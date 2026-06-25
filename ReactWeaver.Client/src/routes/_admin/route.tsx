import { getCurrentUser } from "@/lib/api";
import { getCurrentUserOptions } from "@/lib/api/@tanstack/react-query.gen";
import { AdminView } from "@/modules/admin/admin.view";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin")({
  async beforeLoad() {
    const query = await getCurrentUser();

    if (query.error) {
      redirect({
        to: "/login",
        throw: true,
      });
    }

    if (query.data && !query.data.roles.includes("Admin")) {
      redirect({
        to: "/",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.ensureQueryData(getCurrentUserOptions());
  },
  component: AdminView,
});
