import { getUsersOptions } from "#src/lib/api/@tanstack/react-query.gen.ts";
import { UsersView } from "#src/modules/admin/users/users.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  loader({ context }) {
    return context.queryClient.query({ ...getUsersOptions(), staleTime: "static" });
  },
  component: UsersView,
});
