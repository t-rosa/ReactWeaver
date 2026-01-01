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
import { $api } from "@/lib/api/client";
import { TrashSimpleIcon } from "@phosphor-icons/react";

interface RemoveUsersProps {
  ids: string[];
}

export function RemoveUsers(props: RemoveUsersProps) {
  const removeUsers = $api.useMutation("post", "/api/users/bulk-delete", {
    meta: { invalidatesQuery: $api.queryOptions("get", "/api/users").queryKey },
  });

  if (props.ids.length === 0) {
    return null;
  }

  function handleRemoveClick() {
    removeUsers.mutate({
      body: props.ids,
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
