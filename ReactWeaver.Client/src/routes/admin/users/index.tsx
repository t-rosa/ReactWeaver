import { getGetUsersQueryOptions } from "#src/lib/api/endpoints/index.ts";
import { UsersView } from "#src/modules/admin/users/users.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  loader({ context }) {
    return context.queryClient.query({ ...getGetUsersQueryOptions(), staleTime: "static" });
  },
  component: UsersView,
});
