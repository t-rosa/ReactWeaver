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
import { RemoveForecast } from "@/modules/app/forecasts/remove-forecast.view";
import { DotsThreeIcon } from "@phosphor-icons/react";
import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import { UpdateForecast } from "./update-forecast.view";

type ForecastResponse = components["schemas"]["WeatherForecastResponse"];
type ForecastActionsProps = CellContext<ForecastResponse, unknown>;

export function ForecastActions(props: ForecastActionsProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);

  const forecast = props.row.original;

  function handleCopyIdClick() {
    void navigator.clipboard.writeText(forecast.id);
  }

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" />}>
          <DotsThreeIcon />
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
