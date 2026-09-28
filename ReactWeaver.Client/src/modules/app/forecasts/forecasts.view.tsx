import { Container } from "#src/components/container.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { getWeatherForecastsOptions } from "#src/lib/api/@tanstack/react-query.gen.ts";
import { m } from "#src/paraglide/messages.js";
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
          <BreadcrumbLink>{m.forecasts_title()}</BreadcrumbLink>
        </BreadcrumbItem>
      </AppHeader>
      <Container>
        <ForecastTable columns={FORECAST_COLUMNS} data={data} />
      </Container>
    </AppInset>
  );
}
