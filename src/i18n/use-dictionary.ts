"use client";

import { useParams } from "next/navigation";
import { dictionaryFor } from "./get-dictionary";

export function useDictionary() {
  const { lang } = useParams<{ lang: string }>();
  return dictionaryFor(lang);
}
