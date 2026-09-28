import { ForgotPasswordView } from "#src/modules/auth/forgot-password.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPasswordView,
});
