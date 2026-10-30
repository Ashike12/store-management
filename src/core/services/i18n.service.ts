import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {
  enTransLations,
  bnTransLations,
  zhTransLations,
} from 'assets/i18n';
import {DEFAULT_LANGUAGE} from '@core/config/constants';

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: ['en', 'bn', 'zh'],
  load: 'languageOnly',
  interpolation: {escapeValue: false},
  resources: {
    en: {
      translation: enTransLations,
    },
    bn: {
      translation: bnTransLations,
    },
    zh: {
      translation: zhTransLations,
    },
  },
});
export default i18n;
