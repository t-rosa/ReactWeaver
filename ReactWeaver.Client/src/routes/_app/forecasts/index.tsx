import { $api } from "@/lib/api/client";
import { ForecastsView } from "@/modules/app/forecasts/forecasts.view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/forecasts/")({
  loader({ context }) {
    return context.queryClient.ensureQueryData($api.queryOptions("get", "/api/weather-forecasts"));
  },
  component: ForecastsView,
});
