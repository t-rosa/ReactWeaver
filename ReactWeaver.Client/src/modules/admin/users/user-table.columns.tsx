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
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: function Cell({ row }) {
      const { user } = useUser();
      return (
        <Checkbox
          checked={row.getIsSelected() && row.original.id !== user.id}
          onCheckedChange={(value) => {
            if (row.original.id !== user.id) {
              row.toggleSelected(!!value);
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowsDownUpIcon />
        </Button>
      );
    },
  }),
  columnHelper.accessor("roles", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Roles
          <ArrowsDownUpIcon />
        </Button>
      );
    },
  }),
  columnHelper.accessor("isEmailConfirmed", {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
