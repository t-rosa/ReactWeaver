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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  getWeatherForecastsQueryKey,
  removeWeatherForecastsMutation,
} from "@/lib/api/@tanstack/react-query.gen";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";

interface RemoveForecastsProps {
  ids: string[];
}

export function RemoveForecasts(props: RemoveForecastsProps) {
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
        Remove
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected forecast(s).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
