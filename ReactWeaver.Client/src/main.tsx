import "#src/index.css";

import { App } from "#src/app/index.tsx";
import * as React from "react";
import ReactDOM from "react-dom/client";
import { getRouter } from "./app/router";
import { getLocale, getTextDirection } from "./paraglide/runtime";

const router = getRouter();

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  document.documentElement.lang = getLocale();
  document.documentElement.dir = getTextDirection();

  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App router={router} />
    </React.StrictMode>,
  );
}
