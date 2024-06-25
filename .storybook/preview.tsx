import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider, ToastProvider } from "@peculiar/react-components";
import { theme } from "../src/config/theme";
import i18n from "../src/i18n";
import "../public/assets/styles/reset.css";
import "../src/global.scss";
import "./storybook.css";

const preview: Preview = {
  parameters: {
    i18n,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    actions: { argTypesRegex: "^on.*" },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <Story />
        </ToastProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
