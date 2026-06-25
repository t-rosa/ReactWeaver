import { getCurrentUserOptions } from "@/lib/api/@tanstack/react-query.gen";
import { useSuspenseQuery } from "@tanstack/react-query";

export type UserRole = "Admin" | "Member";

export function useUser() {
  const { data: user } = useSuspenseQuery({ ...getCurrentUserOptions() });

  function hasRole(role: UserRole) {
    return user.roles.includes(role) ?? false;
  }

  return { user, hasRole };
}
