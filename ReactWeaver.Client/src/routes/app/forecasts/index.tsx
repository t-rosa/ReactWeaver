import { getWeatherForecastsOptions } from "#/lib/api/@tanstack/react-query.gen.ts";
import { ForecastsView } from "#/modules/app/forecasts/forecasts.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/forecasts/")({
  loader({ context }) {
    return context.queryClient.ensureQueryData(getWeatherForecastsOptions());
  },
  component: ForecastsView,
});
