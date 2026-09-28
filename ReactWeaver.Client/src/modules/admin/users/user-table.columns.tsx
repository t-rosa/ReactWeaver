import { Button } from "#src/components/ui/button.tsx";
import { Checkbox } from "#src/components/ui/checkbox.tsx";
import type { UserResponse } from "#src/lib/api/index.ts";
import { useUser } from "#src/modules/auth/authorize/authorize.hooks.tsx";
import { m } from "#src/paraglide/messages.js";
import { ArrowsDownUpIcon } from "@phosphor-icons/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { userTableFeatures } from "./table-features";
import { UserActions } from "./user-actions.view";

const columnHelper = createColumnHelper<typeof userTableFeatures, UserResponse>();

export const USER_COLUMNS = columnHelper.columns([
  columnHelper.accessor("id", {
    id: "select",
    header: (context) => (
      <Checkbox
        checked={
          context.table.getIsAllPageRowsSelected() || context.table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => context.table.toggleAllPageRowsSelected(!!value)}
        aria-label={m.common_select_all()}
      />
    ),
    cell: function Cell(context) {
      const { user } = useUser();
      const id = context.getValue();

      return (
        <Checkbox
          checked={context.row.getIsSelected() && id !== user.id}
          onCheckedChange={(value) => {
            if (id !== user.id) {
              context.row.toggleSelected(!!value);
            }
          }}
          aria-label={m.common_select_row()}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("email", {
    header: (context) => {
      return (
        <Button
          variant="ghost"
          onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
        >
          {m.common_email()}
          <ArrowsDownUpIcon />
        </Button>
      );
    },
  }),
  columnHelper.accessor("roles", {
    header: (context) => {
      return (
        <Button
          variant="ghost"
          onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
        >
          {m.common_roles()}
          <ArrowsDownUpIcon />
        </Button>
      );
    },
  }),
  columnHelper.accessor("isEmailConfirmed", {
    header: (context) => {
      return (
        <Button
          variant="ghost"
          onClick={() => context.column.toggleSorting(context.column.getIsSorted() === "asc")}
        >
          {m.users_email_confirmed()}
          <ArrowsDownUpIcon />
        </Button>
      );
    },
  }),
  columnHelper.accessor("id", {
    id: "actions",
    header: () => null,
    cell: UserActions,
  }),
]);
