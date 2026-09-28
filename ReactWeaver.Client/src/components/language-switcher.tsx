import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "#src/components/ui/dropdown-menu.tsx";
import { SidebarMenuButton, SidebarMenuItem } from "#src/components/ui/sidebar.tsx";
import { m } from "#src/paraglide/messages.js";
import { getLocale, isLocale, locales, setLocale, type Locale } from "#src/paraglide/runtime.js";
import { TranslateIcon } from "@phosphor-icons/react";

const LOCALE_LABELS: Record<Locale, () => string> = {
  en: () => m.language_english(),
  fr: () => m.language_french(),
};

export function LanguageSwitcher() {
  const current = getLocale();

  function handleValueChange(value: unknown) {
    if (isLocale(value) && value !== current) {
      // Paraglide reloads the document so every message is re-evaluated with the new locale.
      void setLocale(value);
    }
  }

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<SidebarMenuButton size="sm" aria-label={m.language_switch_label()} />}
        >
          <TranslateIcon />
          <span>{LOCALE_LABELS[current]()}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup value={current} onValueChange={handleValueChange}>
            {locales.map((locale) => (
              <DropdownMenuRadioItem key={locale} value={locale}>
                {LOCALE_LABELS[locale]()}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
