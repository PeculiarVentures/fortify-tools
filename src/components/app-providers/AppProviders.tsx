import React from "react";
import { ThemeProvider, ToastProvider } from "@peculiar/react-components";
import { theme } from "../../config/theme";

export const AppProviders: React.FunctionComponent<{
  children: React.ReactNode;
}> = (props) => {
  const { children } = props;

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
