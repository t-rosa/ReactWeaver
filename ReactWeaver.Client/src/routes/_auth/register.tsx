import { RegisterView } from "#/modules/auth/register.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterView,
});
