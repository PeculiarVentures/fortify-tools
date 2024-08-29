import type { Meta, StoryObj } from "@storybook/react";
import { HighlightedText } from "./HighlightedText";

const meta: Meta<typeof HighlightedText> = {
  title: "Components/HighlightedText",
  component: HighlightedText,
};

export default meta;
type Story = StoryObj<typeof HighlightedText>;

export const Default: Story = {
  args: {
    text: "Lorem test string Test string",
    highlight: "TesT",
  },
};
