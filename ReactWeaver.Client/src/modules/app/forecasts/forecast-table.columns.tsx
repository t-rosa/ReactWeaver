import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { components } from "@/lib/api/schema";
import { ArrowsDownUpIcon } from "@phosphor-icons/react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { ForecastActions } from "./forecast-actions.view";
import type { forecastTableFeatures } from "./table-features";

const columnHelper = createColumnHelper<
  typeof forecastTableFeatures,
  components["schemas"]["WeatherForecastResponse"]
>();

export const FORECAST_COLUMNS: ColumnDef<
  typeof forecastTableFeatures,
  components["schemas"]["WeatherForecastResponse"]
>[] = columnHelper.columns([
  columnHelper.accessor("id", {
    id: "select",
    header: (context) => (
      <Checkbox
        checked={
          context.table.getIsAllPageRowsSelected() || context.table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => context.table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: (context) => (
      <Checkbox
        checked={context.row.getIsSelected()}
        onCheckedChange={(value) => context.row.toggleSelected(!!value)}
        aria-label="Select row"
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
          Date
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
          Temperature C
          <ArrowsDownUpIcon />
        </Button>
      );
    },
  }),
  columnHelper.accessor("summary", {
    header: "Summary",
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: () => null,
    cell: ForecastActions,
  }),
]);
