import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { components } from "@/lib/api/schema";
import { useUser } from "@/modules/auth/authorize/authorize.hooks";
import { ArrowsDownUpIcon } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { UserActions } from "./user-actions.view";

export const USER_COLUMNS: ColumnDef<components["schemas"]["UserResponse"]>[] = [
  {
    id: "select",
    accessorKey: "id",
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
  },
  {
    accessorKey: "email",
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
  },
  {
    accessorKey: "roles",
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
  },
  {
    accessorKey: "isEmailConfirmed",
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
  },
  {
    id: "actions",
    accessorKey: "id",
    header: () => null,
    cell: UserActions,
  },
];
