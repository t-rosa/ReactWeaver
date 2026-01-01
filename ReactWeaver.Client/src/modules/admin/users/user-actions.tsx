import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { components } from "@/lib/api/schema";
import { DotsThreeIcon } from "@phosphor-icons/react";
import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import { RemoveUser } from "./remove-user";

type UserResponse = components["schemas"]["UserResponse"];
type UserActionsProps = CellContext<UserResponse, unknown>;

export function UserActions(props: UserActionsProps) {
  const [alertOpen, setAlertOpen] = React.useState(false);

  const user = props.row.original;

  function handleCopyIdClick() {
    void navigator.clipboard.writeText(user.id);
  }

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" />}>
          <DotsThreeIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopyIdClick}>Copy ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAlertOpen(true)}>Remove</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <RemoveUser open={alertOpen} setOpen={setAlertOpen} id={user.id} />
    </React.Fragment>
  );
}
