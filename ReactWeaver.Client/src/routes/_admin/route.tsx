import { $api, $client } from "@/lib/api/client";
import { AdminView } from "@/modules/admin/admin.view";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin")({
  async beforeLoad() {
    const query = await $client.GET("/api/users/me");

    if (!query.response.ok) {
      redirect({
        to: "/login",
        throw: true,
      });
    }

    if (query.data && !query.data.roles.includes("Admin")) {
      redirect({
        to: "/",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.ensureQueryData($api.queryOptions("get", "/api/users/me"));
  },
  component: AdminView,
});
