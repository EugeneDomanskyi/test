import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/langs/en.json'
import fr from '@/langs/fr.json'
import de from '@/langs/de.json'

const i18nInit = (defaultLng) => {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
    },

    lng: defaultLng,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  })

  return i18n
}

export default i18nInit
