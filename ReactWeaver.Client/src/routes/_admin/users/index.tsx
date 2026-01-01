import { $api } from "@/lib/api/client";
import { UsersView } from "@/modules/admin/users/users.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/users/")({
  loader({ context }) {
    return context.queryClient.ensureQueryData($api.queryOptions("get", "/api/users"));
  },
  component: UsersView,
});
