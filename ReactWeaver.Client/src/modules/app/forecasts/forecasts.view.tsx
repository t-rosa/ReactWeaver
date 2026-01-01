import { $api } from "@/lib/api/client";
import { AppLayout } from "../app.ui";
import { FORECAST_COLUMNS } from "./forecast-table/forecast-columns";
import { ForecastTable } from "./forecast-table/forecast-table.view";

export function ForecastsView() {
  const { data } = $api.useSuspenseQuery("get", "/api/weather-forecasts");

  return (
    <AppLayout>
      <AppLayout.Title title="Forecasts" />
      <AppLayout.Content>
        <ForecastTable columns={FORECAST_COLUMNS} data={data} />
      </AppLayout.Content>
    </AppLayout>
  );
}
