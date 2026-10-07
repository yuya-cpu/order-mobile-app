import type { Locale } from "./config";
import en from "./en.json";
import ja from "./ja.json";

export type Dictionary = typeof ja;

const dictionaries = { ja, en };

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale];
}

export function dictionaryFor(lang: string | string[] | undefined): Dictionary {
  const value = Array.isArray(lang) ? lang[0] : lang;
  return value === "en" ? en : ja;
}
