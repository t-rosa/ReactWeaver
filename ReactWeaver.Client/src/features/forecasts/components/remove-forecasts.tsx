import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#src/components/ui/alert-dialog.tsx";
import { Button } from "#src/components/ui/button.tsx";
import {
  getGetWeatherForecastsQueryKey,
  getRemoveWeatherForecastsMutationOptions,
} from "#src/lib/api/endpoints/index.ts";
import type { RemoveWeatherForecastsRequest } from "#src/lib/api/models/index.ts";
import { m } from "#src/paraglide/messages.js";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";

export function RemoveForecasts(props: RemoveWeatherForecastsRequest) {
  const removeForecasts = useMutation({
    ...getRemoveWeatherForecastsMutationOptions(),
    meta: {
      invalidatesQuery: getGetWeatherForecastsQueryKey(),
    },
  });

  if (props.ids.length === 0) {
    return null;
  }

  function handleRemoveClick() {
    removeForecasts.mutate({
      data: {
        ids: props.ids,
      },
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        <TrashSimpleIcon />
        {m.common_remove()}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.common_confirm_title()}</AlertDialogTitle>
          <AlertDialogDescription>{m.forecasts_confirm_delete_many()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveClick}>{m.common_continue()}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
