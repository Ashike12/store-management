import {createSelector, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {DEFAULT_LANGUAGE} from '@core/config/constants';
import {TranslationData} from '@core/interfaces/api/langaugeKeyValue.model';

const namespace = 'languages';
export interface ILanguageState {
  selection: string;
  i18nAPIResponse: TranslationData[];
}

const initialState: ILanguageState = {
  selection: DEFAULT_LANGUAGE,
  i18nAPIResponse: [],
};

const appLanguageSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    updateLanguage: (state, action: {type: string; payload: string}) => {
      state.selection = action.payload;
    },
    updatei18nAPIResponse: (
      state,
      action: {type: string; payload: TranslationData[]},
    ) => {
      state.i18nAPIResponse = action.payload;
    },
  },
});
export const {updateLanguage, updatei18nAPIResponse} = appLanguageSlice.actions;
export const selectAppLanguage = (state: RootState) => state.persisted.language;

// Memoized selector to get the entire language state
const selectLanguageState = (state: RootState) => state.persisted.language;

export const selectTranslation = (key: string) =>
  createSelector([selectLanguageState], languageState => {
    if (!key) return key;
    const language = languageState.selection ?? DEFAULT_LANGUAGE;
    const langageKey = language + '-' + language.toUpperCase();
    const entry = languageState.i18nAPIResponse.find(
      t => t.key === key || t.key === key.toLowerCase(),
    );
    return entry?.translations[langageKey] || key; // Fallback to key if not found
  });

export default appLanguageSlice.reducer;
