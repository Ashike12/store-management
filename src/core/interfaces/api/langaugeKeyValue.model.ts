export interface TranslationData {
  key: string;
  translations: {
    [languageCode: string]: string;
  };
}

export interface ILangaugeKeyValueResponse {
  data: TranslationData[];
}
