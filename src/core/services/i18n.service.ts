import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {
  enTransLations,
  bnTransLations,
} from 'assets/i18n';
import {DEFAULT_LANGUAGE} from '@core/config/constants';

i18n.use(initReactI18next).init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  preload: [DEFAULT_LANGUAGE],
  resources: {
    en: {
      translation: enTransLations,
    },
    bn: {
      translation: bnTransLations,
    },
  },
});
export default i18n;
