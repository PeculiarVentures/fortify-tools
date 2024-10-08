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
  tags: ["autodocs"],
};

export default preview;
