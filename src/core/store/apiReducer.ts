import {usersApi} from './api';

// Set up the API reducers dynamically
export const apiReducers = {
  [usersApi.reducerPath]: usersApi.reducer,
};

// Dynamically collect all API middlewares
export const apiMiddlewares = [usersApi.middleware];
