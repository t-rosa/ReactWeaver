import { ForgotPasswordForm } from "#src/features/auth/components/forgot-password-form.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordForm,
});
