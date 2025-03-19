import { usersApi } from './api';
import { authApi } from './api/authAPI';
import { productApi } from './api/product';

// Set up the API reducers dynamically
export const apiReducers = {
  [usersApi.reducerPath]: usersApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
};

// Dynamically collect all API middlewares
export const apiMiddlewares = [
  usersApi.middleware,
  authApi.middleware,
  productApi.middleware,
];
