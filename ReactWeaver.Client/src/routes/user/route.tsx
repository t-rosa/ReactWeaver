import { getCurrentUser } from "#src/lib/api/index.ts";
import { UserView } from "#src/modules/user/user.view.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/user")({
  async beforeLoad() {
    const query = await getCurrentUser();
    if (query.error) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  component: UserView,
});
