export type Theme = "dark" | "light";

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
