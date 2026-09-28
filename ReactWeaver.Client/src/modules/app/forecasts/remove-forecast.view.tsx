import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#src/components/ui/alert-dialog.tsx";
import {
  getWeatherForecastsQueryKey,
  removeWeatherForecastMutation,
} from "#src/lib/api/@tanstack/react-query.gen.ts";
import { m } from "#src/paraglide/messages.js";
import { useMutation } from "@tanstack/react-query";

interface RemoveForecastProps {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RemoveForecast(props: RemoveForecastProps) {
  const removeForecast = useMutation({
    ...removeWeatherForecastMutation(),
    meta: {
      invalidatesQuery: getWeatherForecastsQueryKey(),
    },
  });

  function handleRemoveClick() {
    removeForecast.mutate(
      {
        path: {
          id: props.id,
        },
      },
      {
        onSuccess() {
          props.setOpen(false);
        },
      },
    );
  }

  return (
    <AlertDialog open={props.open} onOpenChange={props.setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.common_confirm_title()}</AlertDialogTitle>
          <AlertDialogDescription>{m.forecasts_confirm_delete_one()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveClick}>{m.common_continue()}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
