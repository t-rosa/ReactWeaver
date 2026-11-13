import { useUser } from "../hooks/use-user";
import type { UserRole } from "../types/user-role";

interface AuthorizeProps extends React.PropsWithChildren {
  role: UserRole;
}

export function Authorize(props: AuthorizeProps) {
  const { hasRole } = useUser();

  if (hasRole(props.role)) {
    return props.children;
  }

  return null;
}
