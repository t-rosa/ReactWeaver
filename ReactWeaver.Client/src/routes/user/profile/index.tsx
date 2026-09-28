import { UserProfileView } from "#src/modules/user/user-profile.view.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/profile/")({
  component: UserProfileView,
});
