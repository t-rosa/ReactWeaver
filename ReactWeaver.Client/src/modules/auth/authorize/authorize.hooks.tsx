import { getGetCurrentUserSuspenseQueryOptions } from "#src/lib/api/endpoints/index.ts";
import { useSuspenseQuery } from "@tanstack/react-query";

export type UserRole = "Admin" | "Member";

export function useUser() {
  const { data: user } = useSuspenseQuery({ ...getGetCurrentUserSuspenseQueryOptions() });

  function hasRole(role: UserRole) {
    return user.roles.includes(role) ?? false;
  }

  return { user, hasRole };
}
