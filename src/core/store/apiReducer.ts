import {usersApi} from './api';
import { authApi } from './api/authAPI';

// Set up the API reducers dynamically
export const apiReducers = {
  [usersApi.reducerPath]: usersApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
};

// Dynamically collect all API middlewares
export const apiMiddlewares = [usersApi.middleware, authApi.middleware];
