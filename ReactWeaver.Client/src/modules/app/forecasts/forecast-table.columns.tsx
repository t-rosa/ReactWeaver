import { Button } from "#src/components/ui/button.tsx";
import { Checkbox } from "#src/components/ui/checkbox.tsx";
import type { WeatherForecastResponse } from "#src/lib/api/index.ts";
import { m } from "#src/paraglide/messages.js";
import { ArrowsDownUpIcon } from "@phosphor-icons/react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ForecastActions } from "./forecast-actions.view";
import type { forecastTableFeatures } from "./table-features";

const columnHelper = createColumnHelper<typeof forecastTableFeatures, WeatherForecastResponse>();

export const FORECAST_COLUMNS: ColumnDef<typeof forecastTableFeatures, WeatherForecastResponse>[] =
  columnHelper.columns([
    columnHelper.accessor("id", {
      id: "select",
      header: (context) => (
        <Checkbox
          checked={
            context.table.getIsAllPageRowsSelected() || context.table.getIsSomePageRowsSelected()
          }
          onCheckedChange={(value) => context.table.toggleAllPageRowsSelected(!!value)}
          aria-label={m.common_select_all()}
        />
      ),
      cell: (context) => (
        <Checkbox
          checked={context.row.getIsSelected()}
          onCheckedChange={(value) => context.row.toggleSelected(!!value)}
          aria-label={m.common_select_row()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("date", {
      header: (context) => {
        return (
          <Button
            variant="ghost"
            onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
          >
            {m.common_date()}
            <ArrowsDownUpIcon />
          </Button>
        );
      },
    }),
    columnHelper.accessor("temperatureC", {
      header: (context) => {
        return (
          <Button
            variant="ghost"
            onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
          >
            {m.forecasts_column_temperature()}
            <ArrowsDownUpIcon />
          </Button>
        );
      },
    }),
    columnHelper.accessor("summary", {
      header: () => m.common_summary(),
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: () => null,
      cell: ForecastActions,
    }),
  ]);
