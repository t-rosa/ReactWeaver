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
import { getUsersQueryKey, removeUserMutation } from "@/lib/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";

interface RemoveUserProps {
  id: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function RemoveUser(props: RemoveUserProps) {
  const removeUser = useMutation({
    ...removeUserMutation(),
    meta: {
      invalidatesQuery: getUsersQueryKey(),
    },
  });

  function handleRemoveClick() {
    removeUser.mutate(
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
