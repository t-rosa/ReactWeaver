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
import { $api } from "@/lib/api/client";

interface RemoveUserProps {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RemoveUser(props: RemoveUserProps) {
  const removeUser = $api.useMutation("delete", "/api/users/{id}", {
    meta: { invalidatesQuery: $api.queryOptions("get", "/api/users").queryKey },
  });

  function handleRemoveClick() {
    removeUser.mutate(
      {
        params: {
          path: {
            id: props.id,
          },
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
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
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
