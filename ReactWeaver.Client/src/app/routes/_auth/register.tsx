import { RegisterForm } from "#src/features/auth/components/register-form.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterForm,
});
