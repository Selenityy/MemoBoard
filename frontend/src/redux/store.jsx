import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import memoReducer from "./features/memoSlice";
import tagReducer from "./features/tagsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    memo: memoReducer,
    tag: tagReducer,
  },
});

export default store;
