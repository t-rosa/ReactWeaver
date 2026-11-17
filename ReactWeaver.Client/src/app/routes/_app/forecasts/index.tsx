import { Container } from "#src/components/container.tsx";
import { Header } from "#src/components/header.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import * as React from "react";
import { FORECAST_COLUMNS } from "#src/features/forecasts/components/forecast-table.columns.tsx";
import { ForecastTable } from "#src/features/forecasts/components/forecast-table.tsx";
import {
  getGetWeatherForecastsQueryOptions,
  getGetWeatherForecastsSuspenseQueryOptions,
} from "#src/lib/api/endpoints/index.ts";
import { m } from "#src/lib/i18n/paraglide/messages.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/forecasts/")({
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
    <React.Fragment>
      <Header>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.forecasts_title()}</BreadcrumbLink>
        </BreadcrumbItem>
      </Header>
      <Container>
        <ForecastTable columns={FORECAST_COLUMNS} data={data} />
      </Container>
    </React.Fragment>
  );
}
