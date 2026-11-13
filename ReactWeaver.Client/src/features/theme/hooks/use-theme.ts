import * as React from "react";
import { ThemeContext } from "../store/theme-context";

export function useTheme() {
  const context = React.use(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
