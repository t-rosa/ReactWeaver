import * as React from "react";
import type { ThemeState } from "./theme.types";

const initialState: ThemeState = {
  theme: "light",
  setTheme: () => null,
};

export const ThemeContext = React.createContext<ThemeState>(initialState);
