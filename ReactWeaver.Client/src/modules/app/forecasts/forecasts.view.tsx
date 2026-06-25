import { getWeatherForecastsOptions } from "@/lib/api/@tanstack/react-query.gen";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as AppLayout from "../components/app-layout";
import { FORECAST_COLUMNS } from "./forecast-table.columns";
import { ForecastTable } from "./forecast-table.view";

export function ForecastsView() {
  const { data } = useSuspenseQuery(getWeatherForecastsOptions());

  return (
    <AppLayout.Root>
      <AppLayout.Title title="Forecasts" />
      <AppLayout.Content>
        <ForecastTable columns={FORECAST_COLUMNS} data={data} />
      </AppLayout.Content>
    </AppLayout.Root>
  );
}
