import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { getCurrentUserQueryKey, logoutMutation } from "@/lib/api/@tanstack/react-query.gen";
import { SignOutIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function LogoutView() {
  const navigate = useNavigate();
  const logout = useMutation({
    ...logoutMutation(),
    async onSuccess() {
      toast.success("Logged out");
      await navigate({ to: "/" });
    },
    meta: {
      errorMessage: "An error has occurred",
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
        Logging out
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem onClick={handleClick}>
      <SignOutIcon />
      Log out
    </DropdownMenuItem>
  );
}
