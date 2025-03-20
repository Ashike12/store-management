import {configureStore} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  REGISTER,
  PURGE,
} from 'redux-persist';
import localReducer from './localReducers'; // Combine reducers
import {apiMiddlewares, apiReducers} from './apiReducer';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['language']
};

const persistedReducer = persistReducer(persistConfig, localReducer);

export const store = configureStore({
  reducer: {
    persisted: persistedReducer, // Combining the persisted reducer
    ...apiReducers, // Dynamically adding API reducers
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(...apiMiddlewares), // Keep your existing API middlewares
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
