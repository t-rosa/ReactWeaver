import { Container } from "#src/components/container.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import { getUsersOptions } from "#src/lib/api/@tanstack/react-query.gen.ts";
import { AppHeader } from "#src/modules/app/components/app-header.tsx";
import { AppInset } from "#src/modules/app/components/app-inset.tsx";
import { m } from "#src/paraglide/messages.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { USER_COLUMNS } from "./user-table.columns";
import { UserTable } from "./user-table.view";

export function UsersView() {
  const { data } = useSuspenseQuery(getUsersOptions());

  return (
    <AppInset>
      <AppHeader>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.users_title()}</BreadcrumbLink>
        </BreadcrumbItem>
      </AppHeader>
      <Container>
        <UserTable columns={USER_COLUMNS} data={data} />
      </Container>
    </AppInset>
  );
}
