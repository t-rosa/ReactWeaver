import {
  getCurrentUser,
  getGetWeatherForecastsQueryOptions,
} from "#src/lib/api/endpoints/index.ts";
import { AppView } from "#src/modules/app/app.view.tsx";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.query({
      ...getGetWeatherForecastsQueryOptions(),
      staleTime: "static",
    });
  },
  component: AppView,
});
