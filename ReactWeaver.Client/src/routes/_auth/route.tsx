import { getCurrentUser } from "@/lib/api";
import { AuthView } from "@/modules/auth/auth.view";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  async beforeLoad() {
    const query = await getCurrentUser();
    if (!query.error) {
      redirect({ to: "/forecasts", throw: true });
    }
  },
  component: AuthView,
});
