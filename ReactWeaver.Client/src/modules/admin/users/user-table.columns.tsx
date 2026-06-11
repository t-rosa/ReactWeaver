import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { components } from "@/lib/api/schema";
import { useUser } from "@/modules/auth/authorize/authorize.hooks";
import { ArrowsDownUpIcon } from "@phosphor-icons/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { userTableFeatures } from "./table-features";
import { UserActions } from "./user-actions.view";

const columnHelper = createColumnHelper<
  typeof userTableFeatures,
  components["schemas"]["UserResponse"]
>();

export const USER_COLUMNS = columnHelper.columns([
  columnHelper.accessor("id", {
    id: "select",
    header: (context) => (
      <Checkbox
        checked={
          context.table.getIsAllPageRowsSelected() || context.table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => context.table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
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
          aria-label="Select row"
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
          Email
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
          Roles
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
          Email confirmed
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
