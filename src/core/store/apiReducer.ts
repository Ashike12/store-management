import { userApi } from './api';
import { authApi } from './api/authAPI';
import { invoiceApi } from './api/invoiceApi';
import { productApi } from './api/product';

// Set up the API reducers dynamically
export const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
};

// Dynamically collect all API middlewares
export const apiMiddlewares = [
  userApi.middleware,
  authApi.middleware,
  productApi.middleware,
  invoiceApi.middleware,
];
