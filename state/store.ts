import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import shop from "./slices/shop";
import location from './slices/location';
import modalData from './slices/modalData';
import accountInfo from './slices/accountInfo';
import ConfirmDialog from './slices/ConfirmDialog';
import modalState from './slices/modalState';
import users from './slices/users';
import messages from './slices/messages';
import game from './slices/game';
import music from './slices/music';
const rootReducer = combineReducers({
  shop,location,modalData,accountInfo,ConfirmDialog,modalState,users,messages,game, music
});

const persistConfig = {
  key: 'root',
  storage: ExpoFileSystemStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const persistor = persistStore(store);