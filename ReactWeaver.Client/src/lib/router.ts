import { ErrorScreen } from "#/components/error-screen.tsx";
import { NotFoundScreen } from "#/components/not-found-screen.tsx";
import { PendingScreen } from "#/components/pending-screen.tsx";
import { routeTree } from "#/routeTree.gen.ts";
import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./query-client";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundScreen,
  defaultPendingComponent: PendingScreen,
  defaultErrorComponent: ErrorScreen,
  defaultViewTransition: true,
  defaultPreloadStaleTime: 0,
  defaultPreload: "intent",
  defaultPendingMs: 150,
  defaultPendingMinMs: 150,
  scrollRestoration: true,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
