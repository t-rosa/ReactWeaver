import { DropdownMenuItem } from "#src/components/ui/dropdown-menu.tsx";
import { Spinner } from "#src/components/ui/spinner.tsx";
import { getCurrentUserQueryKey, logoutMutation } from "#src/lib/api/@tanstack/react-query.gen.ts";
import { m } from "#src/paraglide/messages.js";
import { SignOutIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function LogoutView() {
  const navigate = useNavigate();
  const logout = useMutation({
    ...logoutMutation(),
    async onSuccess() {
      toast.success(m.auth_logged_out());
      await navigate({ to: "/" });
    },
    meta: {
      errorMessage: m.common_error_occurred(),
      invalidatesQuery: getCurrentUserQueryKey(),
    },
  });

  function handleClick() {
    logout.mutate({});
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
