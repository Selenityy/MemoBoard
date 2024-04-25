import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import memoReducer from "./features/memoSlice";
import tagReducer from "./features/tagsSlice";
import projectReducer from "./features/projectSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    memo: memoReducer,
    tag: tagReducer,
    project: projectReducer,
  },
});

export default store;
