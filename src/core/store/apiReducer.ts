import { userApi } from './api';
import { authApi } from './api/authAPI';
import { invoiceApi } from './api/invoiceApi';
import { productApi } from './api/product';
import { ordersApi } from './api/ordersApi';

// Set up the API reducers dynamically
export const apiReducers = {
  [ordersApi.reducerPath]: ordersApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [invoiceApi.reducerPath]: invoiceApi.reducer,
};

// Dynamically collect all API middlewares
export const apiMiddlewares = [
  ordersApi.middleware,
  userApi.middleware,
  authApi.middleware,
  productApi.middleware,
  invoiceApi.middleware,
];
