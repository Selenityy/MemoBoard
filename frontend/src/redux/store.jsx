import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./features/userSlice";
import memoReducer from "./features/memoSlice";
import tagReducer from "./features/tagsSlice";
import projectReducer from "./features/projectSlice";

const rootReducer = combineReducers({
  user: userReducer,
  memo: memoReducer,
  tag: tagReducer,
  project: projectReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
