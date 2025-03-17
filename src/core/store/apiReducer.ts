import {
  usersApi,
  customerApi,
  kvgMitgliedApi,
  partnerSearchApi,
  getLanguageKeyValuesAPI,
  partnerAddressApi,
  partnerOperationApi,
} from './api';

// Set up the API reducers dynamically
export const apiReducers = {
  [usersApi.reducerPath]: usersApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [kvgMitgliedApi.reducerPath]: kvgMitgliedApi.reducer,
  [getLanguageKeyValuesAPI.reducerPath]: getLanguageKeyValuesAPI.reducer,
  [partnerSearchApi.reducerPath]: partnerSearchApi.reducer,
  [partnerAddressApi.reducerPath]: partnerAddressApi.reducer,
  [partnerOperationApi.reducerPath]: partnerOperationApi.reducer,
};

// Dynamically collect all API middlewares
export const apiMiddlewares = [
  usersApi.middleware,
  customerApi.middleware,
  partnerSearchApi.middleware,
  kvgMitgliedApi.middleware,
  getLanguageKeyValuesAPI.middleware,
  partnerAddressApi.middleware,
  partnerOperationApi.middleware,
];
