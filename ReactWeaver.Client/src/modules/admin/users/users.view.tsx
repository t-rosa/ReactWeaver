import { $api } from "@/lib/api/client";
import { AdminLayout } from "../components/admin-layout";
import { USER_COLUMNS } from "./user-table/user-columns";
import { UserTable } from "./user-table/user-table.view";

export function UsersView() {
  const { data } = $api.useSuspenseQuery("get", "/api/users");

  return (
    <AdminLayout>
      <AdminLayout.Title title="Users" />
      <AdminLayout.Content>
        <UserTable columns={USER_COLUMNS} data={data} />
      </AdminLayout.Content>
    </AdminLayout>
  );
}
