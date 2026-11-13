import { ThemeSwitcherMenuItem } from "../components/theme-switcher-menu-item";
import { useTheme } from "../hooks/use-theme";

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
