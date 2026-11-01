import { getGetWeatherForecastsQueryOptions } from "#src/lib/api/endpoints/index.ts";
import { ForecastsView } from "#src/modules/app/forecasts/forecasts.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/forecasts/")({
  loader({ context }) {
    return context.queryClient.query({
      ...getGetWeatherForecastsQueryOptions(),
      staleTime: "static",
    });
  },
  component: ForecastsView,
});
