import { AppLayout } from "#src/components/layouts/app-layout.tsx";
import {
  getCurrentUser,
  getGetWeatherForecastsQueryOptions,
} from "#src/lib/api/endpoints/index.ts";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  async beforeLoad() {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
  loader({ context }) {
    return context.queryClient.query({
      ...getGetWeatherForecastsQueryOptions(),
      staleTime: "static",
    });
  },
  component: AppRoute,
});

function AppRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
