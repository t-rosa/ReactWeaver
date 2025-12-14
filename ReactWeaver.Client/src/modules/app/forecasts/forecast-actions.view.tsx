import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { components } from "@/lib/api/schema";
import { RemoveForecast } from "@/modules/app/forecasts/remove-forecast";
import { IconDots } from "@tabler/icons-react";
import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import { UpdateForecast } from "./update-forecast";

type ForecastActionsProps = CellContext<components["schemas"]["WeatherForecastResponse"], unknown>;

export function ForecastActions(props: ForecastActionsProps) {
  const forecast: components["schemas"]["WeatherForecastResponse"] = props.row.original;

  function handleCopyIdClick() {
    void navigator.clipboard.writeText(forecast.id);
  }
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" />}>
          <IconDots />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopyIdClick}>Copy ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAlertOpen(true)}>Remove</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateForecast open={dialogOpen} setOpen={setDialogOpen} forecast={forecast} />
      <RemoveForecast open={alertOpen} setOpen={setAlertOpen} id={forecast.id} />
    </React.Fragment>
  );
}
