import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import id from "./locales/id.json"

const storageKey = "bite-ui-language"
const supportedLanguages = ["en", "id"] as const

const resolveStoredLanguage = () => {
  if (typeof window === "undefined") {
    return "en"
  }

  const stored = localStorage.getItem(storageKey)
  if (stored && supportedLanguages.includes(stored as (typeof supportedLanguages)[number])) {
    return stored
  }

  return "en"
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: resolveStoredLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  nonExplicitSupportedLngs: true,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

if (typeof window !== "undefined") {
  const updateDocumentLanguage = (language: string) => {
    document.documentElement.lang = language
  }

  updateDocumentLanguage(i18n.language)

  i18n.on("languageChanged", (language) => {
    localStorage.setItem(storageKey, language)
    updateDocumentLanguage(language)
  })
}

export { i18n }
