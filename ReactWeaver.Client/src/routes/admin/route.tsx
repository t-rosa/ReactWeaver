import { getCurrentUserOptions } from "#src/lib/api/@tanstack/react-query.gen.ts";
import { getCurrentUser } from "#src/lib/api/index.ts";
import { AdminView } from "#src/modules/admin/admin.view.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
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
