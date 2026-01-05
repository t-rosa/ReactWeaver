import { Outlet } from "@tanstack/react-router";
import { AuthLayout } from "./components/auth-layout";

export function AuthView() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
