import { defineConfig } from "orval";

const input = "../ReactWeaver.Server/ReactWeaver.Server.json";

export default defineConfig({
  api: {
    input,
    output: {
      mode: "tags-split",
      target: "src/lib/api/endpoints",
      schemas: "src/lib/api/models",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        mutator: {
          path: "src/lib/custom-fetch.ts",
          name: "customFetch",
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
        query: {
          useSuspenseQuery: true,
        },
      },
    },
  },
  zod: {
    input,
    output: {
      mode: "single",
      target: "src/lib/api/zod.ts",
      client: "zod",
      override: {
        zod: {
          version: 4,
        },
      },
    },
  },
});
