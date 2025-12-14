import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { components } from "@/lib/api/schema";
import { IconArrowsUpDown } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { ForecastActions } from "../forecast-actions.view";

export const FORECAST_COLUMNS: ColumnDef<components["schemas"]["WeatherForecastResponse"]>[] = [
  {
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
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <IconArrowsUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "temperatureC",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Temperature C
          <IconArrowsUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "summary",
    header: "Summary",
  },
  {
    id: "actions",
    cell: ForecastActions,
  },
];
