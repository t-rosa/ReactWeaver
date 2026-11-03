import { App } from "#src/app/index.tsx";
import { applyDocumentLocale } from "#src/lib/i18n.ts";
import * as React from "react";
import { createRoot } from "react-dom/client";

import "#src/index.css";

applyDocumentLocale();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
