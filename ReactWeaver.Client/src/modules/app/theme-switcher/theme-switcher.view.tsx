import { useTheme } from "@/components/theme-provider";
import { ThemeSwitcherMenuItem } from "./theme-switcher.ui";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  function handleThemeChange() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return <ThemeSwitcherMenuItem isDark={theme === "dark"} onThemeChange={handleThemeChange} />;
}
