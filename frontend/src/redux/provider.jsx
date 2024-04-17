"use client";

import store from "./store";
import { Provider } from "react-redux";
import { ThemeProvider } from "../context/ThemeContext";

export const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
};
