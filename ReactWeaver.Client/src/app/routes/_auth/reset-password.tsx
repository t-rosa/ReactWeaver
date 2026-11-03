import { ResetPasswordForm } from "#src/features/auth/components/reset-password-form.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPasswordForm,
});
