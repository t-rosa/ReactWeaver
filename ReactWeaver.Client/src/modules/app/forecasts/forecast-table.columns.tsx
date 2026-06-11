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
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("date", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowsDownUpIcon />
        </Button>
      );
    },
  }),
  columnHelper.accessor("temperatureC", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
