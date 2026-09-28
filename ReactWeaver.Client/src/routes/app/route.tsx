import { getWeatherForecastsOptions } from "#src/lib/api/@tanstack/react-query.gen.ts";
import { getCurrentUser } from "#src/lib/api/index.ts";
import { AppView } from "#src/modules/app/app.view.tsx";
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
    return context.queryClient.query({ ...getWeatherForecastsOptions(), staleTime: "static" });
  },
  component: AppView,
});
