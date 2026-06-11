import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemGroup } from "@/components/ui/item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { components } from "@/lib/api/schema";
import { useUser } from "@/modules/auth/authorize/authorize.hooks";
import { FolderIcon } from "@phosphor-icons/react";
import {
  type ColumnDef,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  flexRender,
  sortFns,
  useTable,
} from "@tanstack/react-table";
import { RemoveUsers } from "./remove-users.view";
import { userTableFeatures } from "./table-features";

interface UserTableProps {
  columns: ColumnDef<typeof userTableFeatures, components["schemas"]["UserResponse"]>[];
  data: components["schemas"]["UserResponse"][];
}

export function UserTable(props: UserTableProps) {
  const { user } = useUser();

  const table = useTable({
    features: userTableFeatures,
    rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns),
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    data: props.data,
    columns: props.columns,
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
          <EmptyTitle>No Users Yet</EmptyTitle>
          <EmptyDescription>There is no users registered</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ItemGroup>
      <Item size="xs" render={<header />}>
        <ItemContent>
          <Input
            placeholder="Filter email..."
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
                        {header.isPlaceholder ? null : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  );
}
