import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getWeatherForecastsQueryKey,
  removeWeatherForecastMutation,
} from "@/lib/api/@tanstack/react-query.gen";
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
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected forecast.
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
