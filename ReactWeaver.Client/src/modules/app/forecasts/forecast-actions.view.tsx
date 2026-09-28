import { Button } from "#src/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu.tsx";
import type { WeatherForecastResponse } from "#src/lib/api/index.ts";
import { m } from "#src/paraglide/messages.js";
import { DotsThreeIcon } from "@phosphor-icons/react";
import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import type { forecastTableFeatures } from "./table-features";
import { RemoveForecast } from "./remove-forecast.view";
import { UpdateForecast } from "./update-forecast.view";

type ForecastActionsProps = CellContext<
  typeof forecastTableFeatures,
  WeatherForecastResponse,
  unknown
>;

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
            <DropdownMenuLabel>{m.common_actions()}</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopyIdClick}>{m.common_copy_id()}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDialogOpen(true)}>
              {m.common_edit()}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAlertOpen(true)}>
              {m.common_remove()}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateForecast open={dialogOpen} setOpen={setDialogOpen} forecast={forecast} />
      <RemoveForecast open={alertOpen} setOpen={setAlertOpen} id={forecast.id} />
    </React.Fragment>
  );
}
