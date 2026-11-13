import * as React from "react";
import type { Theme } from "../types/theme";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeState = {
  theme: "light",
  setTheme: () => null,
};

export const ThemeContext = React.createContext<ThemeState>(initialState);
