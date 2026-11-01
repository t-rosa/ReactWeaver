import { getCurrentUser } from "#src/lib/api/endpoints/index.ts";
import { AuthView } from "#src/modules/auth/auth.view.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);
    if (user) {
      redirect({ to: "/app/dashboard", throw: true });
    }
  },
  component: AuthView,
});
