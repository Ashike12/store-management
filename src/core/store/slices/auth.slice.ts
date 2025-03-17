import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {IToken} from '@core/interfaces/auth.model';
import {removeAllPinnedPartners} from './pinned-partner.slice';

const namespace = 'auth';
export interface IAuthState {
  token: IToken;
}

const initialState: IAuthState = {
  token: {} as IToken,
};

export const fetchAllLogout = createAsyncThunk(
  'auth/dispatchAllLogout',
  async (_, {dispatch}) => {
    dispatch(removeAllPinnedPartners());
    dispatch(removeLogin());
  },
);

const authSlice = createSlice({
  name: namespace,
  initialState,
  reducers: {
    addLogin: (state, action: {type: string; payload: IToken}) => {
      state.token = action.payload;
    },
    removeLogin: state => {
      state.token = {} as IToken;
    },
  },
});

export const {addLogin, removeLogin} = authSlice.actions;
export const selectAppIsLogin = (state: RootState) => {
  const token = state.persisted.auth.token;
  if (token?.accessToken && token?.refreshToken) {
    return true;
  }
  return false;
};

export const tokenInfo = (state: RootState): IToken => {
  return state?.persisted?.auth?.token;
};

export default authSlice.reducer;
