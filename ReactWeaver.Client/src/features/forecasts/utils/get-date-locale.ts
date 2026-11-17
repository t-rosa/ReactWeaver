import { getLocale, type Locale } from "#src/lib/i18n/paraglide/runtime.js";
import type { Locale as DateFnsLocale } from "date-fns";
import { enUS, fr } from "date-fns/locale";

const DATE_FNS_LOCALES: Record<Locale, DateFnsLocale> = {
  en: enUS,
  fr,
};

export function getDateLocale(): DateFnsLocale {
  return DATE_FNS_LOCALES[getLocale()];
}
