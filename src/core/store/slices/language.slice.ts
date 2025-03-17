import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {DEFAULT_LANGUAGE} from '@core/config/constants';

const namespace = 'languages';
export interface ILanguageState {
  selection: string;
}

const initialState: ILanguageState = {
  selection: DEFAULT_LANGUAGE,
};

const appLanguageSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    updateLanguage: (state, action: {type: string; payload: string}) => {
      state.selection = action.payload;
    },
  },
});
export const {updateLanguage} = appLanguageSlice.actions;
export const selectAppLanguage = (state: RootState) => state.persisted.language;

export default appLanguageSlice.reducer;
