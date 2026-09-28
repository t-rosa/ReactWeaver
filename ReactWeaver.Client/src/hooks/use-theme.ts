import { ThemeContext } from "#src/components/theme/theme.context.ts";
import * as React from "react";

export function useTheme() {
  const context = React.use(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
