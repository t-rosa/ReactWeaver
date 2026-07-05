import { getWeatherForecastsOptions } from "@/lib/api/@tanstack/react-query.gen";
import { ForecastsView } from "@/modules/app/forecasts/forecasts.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/forecasts/")({
  loader({ context }) {
    return context.queryClient.ensureQueryData(getWeatherForecastsOptions());
  },
  component: ForecastsView,
});
