import { Container } from "#src/components/container.tsx";
import { Header } from "#src/components/header.tsx";
import { BreadcrumbItem, BreadcrumbLink } from "#src/components/ui/breadcrumb.tsx";
import * as React from "react";
import { USER_COLUMNS } from "#src/features/users/components/user-table.columns.tsx";
import { UserTable } from "#src/features/users/components/user-table.tsx";
import {
  getGetUsersQueryOptions,
  getGetUsersSuspenseQueryOptions,
} from "#src/lib/api/endpoints/index.ts";
import { m } from "#src/paraglide/messages.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users/")({
  loader({ context }) {
    return context.queryClient.query({ ...getGetUsersQueryOptions(), staleTime: "static" });
  },
  component: UsersRoute,
});

function UsersRoute() {
  const { data } = useSuspenseQuery(getGetUsersSuspenseQueryOptions());

  return (
    <React.Fragment>
      <Header>
        <BreadcrumbItem>
          <BreadcrumbLink>{m.users_title()}</BreadcrumbLink>
        </BreadcrumbItem>
      </Header>
      <Container>
        <UserTable columns={USER_COLUMNS} data={data} />
      </Container>
    </React.Fragment>
  );
}
