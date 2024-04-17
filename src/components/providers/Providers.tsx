import React from "react";
import { ThemeProvider } from "@peculiar/react-components";

export const Providers: React.FunctionComponent<{
  children: React.ReactElement;
}> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
