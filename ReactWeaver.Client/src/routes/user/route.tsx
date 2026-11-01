import { getCurrentUser } from "#src/lib/api/endpoints/index.ts";
import { UserView } from "#src/modules/user/user.view.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/user")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  component: UserView,
});
