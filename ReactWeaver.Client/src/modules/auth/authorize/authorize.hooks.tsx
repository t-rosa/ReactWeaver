import { getCurrentUserOptions } from "#src/lib/api/@tanstack/react-query.gen.ts";
import { useSuspenseQuery } from "@tanstack/react-query";

export type UserRole = "Admin" | "Member";

export function useUser() {
  const { data: user } = useSuspenseQuery({ ...getCurrentUserOptions() });

  function hasRole(role: UserRole) {
    return user.roles.includes(role) ?? false;
  }

  return { user, hasRole };
}
