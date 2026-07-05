import { Container } from "@/components/container";
import { BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { getUsersOptions } from "@/lib/api/@tanstack/react-query.gen";
import { AppHeader } from "@/modules/app/components/app-header";
import { AppInset } from "@/modules/app/components/app-inset";
import { useSuspenseQuery } from "@tanstack/react-query";
import { USER_COLUMNS } from "./user-table.columns";
import { UserTable } from "./user-table.view";

export function UsersView() {
  const { data } = useSuspenseQuery(getUsersOptions());

  return (
    <AppInset>
      <AppHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>Users</BreadcrumbLink>
        </BreadcrumbItem>
      </AppHeader>
      <Container>
        <UserTable columns={USER_COLUMNS} data={data} />
      </Container>
    </AppInset>
  );
}
