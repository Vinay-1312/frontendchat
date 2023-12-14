// store.js

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userSliceReducer from "./userSlice";
import addSliceReducer from "./addSlice";
import connectionSliceReducer from "./connectionSlice"
import chatSliceReducer from "./chatSlice"
import { combineReducers } from "@reduxjs/toolkit";
import { 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = {
  user: userSliceReducer,
  add: addSliceReducer,
  connection: connectionSliceReducer,
  chat:chatSliceReducer
};

// Change the above `rootReducer` to use `combineReducers`
const combinedReducer = combineReducers(rootReducer);

const persistedReducer = persistReducer(persistConfig, combinedReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
