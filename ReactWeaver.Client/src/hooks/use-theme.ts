import { ThemeContext } from "@/components/theme/theme.context";
import * as React from "react";

export function useTheme() {
  const context = React.use(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
