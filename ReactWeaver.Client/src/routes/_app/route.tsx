import { getCurrentUser } from "@/lib/api";
import { getWeatherForecastsOptions } from "@/lib/api/@tanstack/react-query.gen";
import { AppView } from "@/modules/app/app.view";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
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
