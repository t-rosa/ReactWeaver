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
  getWeatherForecastsQueryKey,
  removeWeatherForecastsMutation,
} from "#src/lib/api/@tanstack/react-query.gen.ts";
import type { RemoveWeatherForecastsRequest } from "#src/lib/api/index.ts";
import { m } from "#src/paraglide/messages.js";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";

export function RemoveForecasts(props: RemoveWeatherForecastsRequest) {
  const removeForecasts = useMutation({
    ...removeWeatherForecastsMutation(),
    meta: {
      invalidatesQuery: getWeatherForecastsQueryKey(),
    },
  });

  if (props.ids.length === 0) {
    return null;
  }

  function handleRemoveClick() {
    removeForecasts.mutate({
      body: {
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
