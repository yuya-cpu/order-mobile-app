export function localizedText(
  lang: string,
  ja: string,
  en?: string | null,
) {
  if (lang === "en" && en?.trim()) return en;
  return ja;
}

export function optionalEnglish(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}
