import { Button } from "#src/components/ui/button.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#src/components/ui/empty.tsx";
import { Input } from "#src/components/ui/input.tsx";
import { Item, ItemActions, ItemContent, ItemGroup } from "#src/components/ui/item.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#src/components/ui/table.tsx";
import type { UserResponse } from "#src/lib/api/index.ts";
import { useUser } from "#src/modules/auth/authorize/authorize.hooks.tsx";
import { m } from "#src/paraglide/messages.js";
import { FolderIcon } from "@phosphor-icons/react";
import { type ColumnDef, useTable } from "@tanstack/react-table";
import { RemoveUsers } from "./remove-users.view";
import { userTableFeatures } from "./table-features";

interface UserTableProps {
  columns: ColumnDef<typeof userTableFeatures, UserResponse>[];
  data: UserResponse[];
}

export function UserTable(props: UserTableProps) {
  const { user } = useUser();

  const table = useTable({
    features: userTableFeatures,
    columns: props.columns,
    data: props.data,
    getRowId: (original) => original.id,
  });

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.filter((row) => row.original.id !== user.id)
    .map((row) => row.original.id);

  if (props.data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderIcon />
          </EmptyMedia>
          <EmptyTitle>{m.users_empty_title()}</EmptyTitle>
          <EmptyDescription>{m.users_empty_description()}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ItemGroup>
      <Item size="xs" render={<header />}>
        <ItemContent>
          <Input
            placeholder={m.placeholder_filter_email()}
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </ItemContent>
        <ItemActions>
          <RemoveUsers ids={selectedIds} />
        </ItemActions>
      </Item>
      <Item size="xs" render={<main />}>
        <ItemContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original.id}
                  data-state={row.getIsSelected() && "selected"}
                  data-disabled={user.id === row.original.id}
                  aria-disabled={user.id === row.original.id}
                  className="data-[disabled=true]:pointer-events-none data-[disabled=true]:bg-destructive/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ItemContent>
      </Item>
      <Item size="xs" render={<footer />}>
        <ItemActions>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {m.common_previous()}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {m.common_next()}
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
