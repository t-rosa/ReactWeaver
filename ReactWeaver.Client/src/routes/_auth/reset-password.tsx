import { ResetPasswordView } from "#/modules/auth/reset-password.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPasswordView,
});
