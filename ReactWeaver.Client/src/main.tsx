import { applyDocumentLocale } from "#src/lib/i18n.ts";
import { queryClient } from "#src/lib/query-client.ts";
import { router } from "#src/lib/router.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import * as React from "react";
import { createRoot } from "react-dom/client";

import "#src/index.css";

applyDocumentLocale();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
