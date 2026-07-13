import { getUsersOptions } from "#/lib/api/@tanstack/react-query.gen.ts";
import { UsersView } from "#/modules/admin/users/users.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  loader({ context }) {
    return context.queryClient.ensureQueryData(getUsersOptions());
  },
  component: UsersView,
});
