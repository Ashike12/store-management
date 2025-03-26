import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IAuthResponse } from '@core/interfaces/api/IAuthResponse';
import { localStorageService, storagePath } from '@core/services/localStorage.service';

const namespace = 'auth';

const initialState: IAuthResponse = {
  login_token: '',
  refresh_token: '',
};

const authSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    addLogin: (state, action: { type: string; payload: IAuthResponse }) => {
      state.login_token = action.payload.login_token;
      state.refresh_token = action.payload.refresh_token;
    },
    removeLogin: state => {
      localStorageService.removeToken();
      state.login_token = '';
      state.refresh_token = '';
    },
  },
});

export const { addLogin, removeLogin } = authSlice.actions;

export const selectAppIsLogin = (state: RootState) => {
  const login_token = state.persisted.auth.login_token == '' ? localStorageService.getItemLocalStore(storagePath.AccessToken) : state.persisted.auth.login_token;
  const refresh_token = state.persisted.auth.refresh_token == '' ? localStorageService.getItemLocalStore(storagePath.RefreshToken) : state.persisted.auth.refresh_token;
  if (login_token != '' && refresh_token != '') {
    return true;
  }
  return false;
};

export const tokenInfo = (state: RootState): IAuthResponse => {
  return state?.persisted?.auth;
};

export default authSlice.reducer;
