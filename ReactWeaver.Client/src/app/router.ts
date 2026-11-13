import { ErrorScreen } from "#src/components/error-screen.tsx";
import { NotFoundScreen } from "#src/components/not-found-screen.tsx";
import { PendingScreen } from "#src/components/pending-screen.tsx";
import { queryClient } from "#src/lib/query-client.ts";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
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
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
