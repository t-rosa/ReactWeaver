import { getUsersOptions } from "@/lib/api/@tanstack/react-query.gen";
import { UsersView } from "@/modules/admin/users/users.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/users/")({
  loader({ context }) {
    return context.queryClient.ensureQueryData(getUsersOptions());
  },
  component: UsersView,
});
