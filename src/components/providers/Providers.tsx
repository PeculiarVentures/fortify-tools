import React from "react";
import { ThemeProvider } from "@peculiar/react-components";
import { theme } from "../../config/theme";

export const Providers: React.FunctionComponent<{
  children: React.ReactElement;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme} cssVarsRoot="#root">
      {children}
    </ThemeProvider>
  );
};
