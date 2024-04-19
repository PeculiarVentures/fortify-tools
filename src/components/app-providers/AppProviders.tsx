import React from "react";
import { ThemeProvider, ToastProvider } from "@peculiar/react-components";
import { theme } from "../../config/theme";

export const AppProviders: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
