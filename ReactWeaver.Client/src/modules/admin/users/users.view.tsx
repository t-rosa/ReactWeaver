import { getUsersOptions } from "@/lib/api/@tanstack/react-query.gen";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as AdminLayout from "../components/admin-layout";
import { USER_COLUMNS } from "./user-table.columns";
import { UserTable } from "./user-table.view";

export function UsersView() {
  const { data } = useSuspenseQuery(getUsersOptions());

  return (
    <AdminLayout.Root>
      <AdminLayout.Title title="Users" />
      <AdminLayout.Content>
        <UserTable columns={USER_COLUMNS} data={data} />
      </AdminLayout.Content>
    </AdminLayout.Root>
  );
}
