import "#src/index.css";

import { App } from "#src/app/app.tsx";
import { applyDocumentLocale } from "#src/lib/i18n.ts";
import * as React from "react";
import ReactDOM from "react-dom/client";
import { getRouter } from "./app/router";

applyDocumentLocale();

const router = getRouter();

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App router={router} />
    </React.StrictMode>,
  );
}
