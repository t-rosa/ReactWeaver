import { Button } from "#src/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu.tsx";
import type { UserResponse } from "#src/lib/api/index.ts";
import { m } from "#src/paraglide/messages.js";
import { DotsThreeIcon } from "@phosphor-icons/react";
import type { CellContext } from "@tanstack/react-table";
import * as React from "react";
import { RemoveUser } from "./remove-user.view";
import type { userTableFeatures } from "./table-features";

type UserActionsProps = CellContext<typeof userTableFeatures, UserResponse>;

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
            <DropdownMenuLabel>{m.common_actions()}</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleCopyIdClick}>{m.common_copy_id()}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setAlertOpen(true)}>
              {m.common_remove()}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <RemoveUser open={alertOpen} setOpen={setAlertOpen} id={user.id} />
    </React.Fragment>
  );
}
