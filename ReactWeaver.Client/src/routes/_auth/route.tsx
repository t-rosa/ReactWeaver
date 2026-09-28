import { getCurrentUser } from "#src/lib/api/index.ts";
import { AuthView } from "#src/modules/auth/auth.view.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  async beforeLoad() {
    const query = await getCurrentUser();
    if (!query.error) {
      redirect({ to: "/app/dashboard", throw: true });
    }
  },
  component: AuthView,
});
