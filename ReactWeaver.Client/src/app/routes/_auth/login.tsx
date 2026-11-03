import { LoginForm } from "#src/features/auth/components/login-form.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: LoginForm,
});
