import { LoginView } from "#/modules/auth/login.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/login")({
  component: LoginView,
});
