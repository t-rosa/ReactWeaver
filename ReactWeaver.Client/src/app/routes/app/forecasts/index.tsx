import { Container } from "#src/components/container.tsx";
import { DashboardHeader } from "#src/components/layouts/dashboard-header.tsx";
import { DashboardInset } from "#src/components/layouts/dashboard-inset.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { FORECAST_COLUMNS } from "#src/features/forecasts/components/forecast-table-columns.tsx";
import { ForecastTable } from "#src/features/forecasts/components/forecast-table.tsx";
import {
  getGetWeatherForecastsQueryOptions,
  getGetWeatherForecastsSuspenseQueryOptions,
} from "#src/lib/api/endpoints/index.ts";
import { m } from "#src/paraglide/messages.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/forecasts/")({
  loader({ context }) {
    return context.queryClient.query({
      ...getGetWeatherForecastsQueryOptions(),
      staleTime: "static",
    });
  },
  component: ForecastsRoute,
});

function ForecastsRoute() {
  const { data } = useSuspenseQuery(getGetWeatherForecastsSuspenseQueryOptions());

  return (
    <DashboardInset>
      <DashboardHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.forecasts_title()}</BreadcrumbLink>
        </BreadcrumbItem>
      </DashboardHeader>
      <Container>
        <ForecastTable columns={FORECAST_COLUMNS} data={data} />
      </Container>
    </DashboardInset>
  );
}
