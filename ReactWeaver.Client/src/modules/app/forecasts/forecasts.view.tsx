import { Container } from "@/components/container";
import { $api } from "@/lib/api/client";
import { AppLayout } from "../app.ui";
import { FORECAST_COLUMNS } from "./forecast-table/forecast-columns";
import { ForecastTable } from "./forecast-table/forecast-table.view";

export function ForecastsView() {
  const { data } = $api.useSuspenseQuery("get", "/api/weather-forecasts");

  return (
    <AppLayout>
      <AppLayout.Header title="Forecasts" />
      <Container>
        <ForecastTable columns={FORECAST_COLUMNS} data={data} />
      </Container>
    </AppLayout>
  );
}
