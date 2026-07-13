import { Container } from "#/components/container.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#/components/ui/breadcrumb.tsx";
import { getWeatherForecastsOptions } from "#/lib/api/@tanstack/react-query.gen.ts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AppHeader } from "../components/app-header";
import { AppInset } from "../components/app-inset";
import { FORECAST_COLUMNS } from "./forecast-table.columns";
import { ForecastTable } from "./forecast-table.view";

export function ForecastsView() {
  const { data } = useSuspenseQuery(getWeatherForecastsOptions());

  return (
    <AppInset>
      <AppHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>Forecast</BreadcrumbLink>
        </BreadcrumbItem>
      </AppHeader>
      <Container>
        <ForecastTable columns={FORECAST_COLUMNS} data={data} />
      </Container>
    </AppInset>
  );
}
