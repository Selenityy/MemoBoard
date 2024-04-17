import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import memoReducer from "./features/memoSlice";
import tagReducer from "./features/tagSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    memo: memoReducer,
    tag: tagReducer,
  },
});

export default store;
