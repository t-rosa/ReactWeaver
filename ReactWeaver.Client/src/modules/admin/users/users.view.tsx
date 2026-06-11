import { $api } from "@/lib/api/client";
import * as AdminLayout from "../components/admin-layout";
import { USER_COLUMNS } from "./user-table.columns";
import { UserTable } from "./user-table.view";

export function UsersView() {
  const { data } = $api.useSuspenseQuery("get", "/api/users");

  return (
    <AdminLayout.Root>
      <AdminLayout.Title title="Users" />
      <AdminLayout.Content>
        <UserTable columns={USER_COLUMNS} data={data} />
      </AdminLayout.Content>
    </AdminLayout.Root>
  );
}
