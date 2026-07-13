import { getWeatherForecastsOptions } from "#/lib/api/@tanstack/react-query.gen.ts";
import { getCurrentUser } from "#/lib/api/index.ts";
import { AppView } from "#/modules/app/app.view.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  async beforeLoad() {
    const query = await getCurrentUser();
    if (query.error) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.ensureQueryData(getWeatherForecastsOptions());
  },
  component: AppView,
});
