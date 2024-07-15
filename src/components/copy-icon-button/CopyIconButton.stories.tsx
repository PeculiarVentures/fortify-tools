import type { Meta, StoryObj } from "@storybook/react";
import { CopyIconButton } from "./CopyIconButton";

const meta: Meta<typeof CopyIconButton> = {
  title: "Components/CopyIconButton",
  component: CopyIconButton,
};

export default meta;
type Story = StoryObj<typeof CopyIconButton>;

export const Default: Story = {
  args: {
    value: "Copied text",
  },
};

export const CallableValue: Story = {
  args: {
    value: () => "Copied text",
  },
};
