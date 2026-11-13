import { getLocale, getTextDirection, type Locale } from "#src/paraglide/runtime.js";
import type { Locale as DateFnsLocale } from "date-fns";
import { enUS, fr } from "date-fns/locale";

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  en: enUS,
  fr,
};

export function getDateFnsLocale(): DateFnsLocale {
  return DATE_FNS_LOCALES[getLocale()];
}

export function applyDocumentLocale(): void {
  const locale = getLocale();
  document.documentElement.lang = locale;
  document.documentElement.dir = getTextDirection(locale);
}
