import { DropdownMenuItem } from "#src/components/ui/dropdown-menu.tsx";
import { Spinner } from "#src/components/ui/spinner.tsx";
import {
  getGetCurrentUserQueryKey,
  getLogoutMutationOptions,
} from "#src/lib/api/endpoints/index.ts";
import { m } from "#src/paraglide/messages.js";
import { SignOutIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "#src/components/ui/toast.tsx";

export function LogoutMenuItem() {
  const navigate = useNavigate();
  const logout = useMutation({
    ...getLogoutMutationOptions(),
    async onSuccess() {
      toast.add({ type: "success", title: m.auth_logged_out() });
      await navigate({ to: "/" });
    },
    onError(error) {
      toast.add({ type: "error", title: error.title, description: error.detail });
    },
    meta: {
      invalidatesQuery: getGetCurrentUserQueryKey(),
    },
  });

  function handleClick() {
    logout.mutate();
  }

  if (logout.status === "pending") {
    return (
      <DropdownMenuItem disabled>
        <Spinner />
        {m.auth_logging_out()}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={handleClick}>
      <SignOutIcon />
      {m.auth_logout()}
    </DropdownMenuItem>
  );
}
