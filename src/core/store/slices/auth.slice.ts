import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IAuthResponse, IAuthTokenPayload } from '@core/interfaces/api/IAuthResponse';
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

const getAccessToken = (state: RootState): string => {
  return state.persisted.auth.login_token == ''
    ? localStorageService.getItemLocalStore(storagePath.AccessToken)
    : state.persisted.auth.login_token;
};

const getJwtPayload = (token: string): IAuthTokenPayload => {
  if (!token) {
    return {};
  }

  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return {};
    }

    return JSON.parse(localStorageService.strDecript(payload)) as IAuthTokenPayload;
  } catch {
    return {};
  }
};

export const selectAuthTokenPayload = (state: RootState): IAuthTokenPayload => {
  return getJwtPayload(getAccessToken(state));
};

export const selectCurrentUserRoles = (state: RootState): string[] => {
  return selectAuthTokenPayload(state).Roles ?? [];
};

export const selectCurrentUserId = (state: RootState): string => {
  return selectAuthTokenPayload(state).UserId ?? '';
};

export const selectCurrentUserName = (state: RootState): string => {
  return selectAuthTokenPayload(state).UserName ?? '';
};

export const selectIsWholeSaler = (state: RootState): boolean => {
  return selectCurrentUserRoles(state).includes('wholesaler');
};

export default authSlice.reducer;
