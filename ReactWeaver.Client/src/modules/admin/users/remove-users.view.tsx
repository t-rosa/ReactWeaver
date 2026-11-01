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
  getGetUsersQueryKey,
  getRemoveUsersMutationOptions,
} from "#src/lib/api/endpoints/index.ts";
import { m } from "#src/paraglide/messages.js";
import { TrashSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";

interface RemoveUsersProps {
  ids: string[];
}

export function RemoveUsers(props: RemoveUsersProps) {
  const removeUsers = useMutation({
    ...getRemoveUsersMutationOptions(),
    meta: {
      invalidatesQuery: getGetUsersQueryKey(),
    },
  });

  if (props.ids.length === 0) {
    return null;
  }

  function handleRemoveClick() {
    removeUsers.mutate({
      data: props.ids,
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
          <AlertDialogDescription>{m.confirm_delete_account()}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveClick}>{m.common_continue()}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
