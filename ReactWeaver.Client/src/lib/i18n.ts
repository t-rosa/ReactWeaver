import { getLocale, getTextDirection, type Locale } from "#src/paraglide/runtime.js";
import type { Locale as DateFnsLocale } from "date-fns";
import { enUS, fr } from "date-fns/locale";

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  en: enUS,
  fr,
};

/** Returns the `date-fns` locale matching the currently active Paraglide locale. */
export function getDateFnsLocale(): DateFnsLocale {
  return DATE_FNS_LOCALES[getLocale()];
}

/** Keeps the `lang` and `dir` attributes of the document in sync with the active locale. */
export function applyDocumentLocale(): void {
  const locale = getLocale();
  document.documentElement.lang = locale;
  document.documentElement.dir = getTextDirection(locale);
}
