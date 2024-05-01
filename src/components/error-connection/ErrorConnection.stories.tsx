import type { Meta, StoryObj } from "@storybook/react";
import { ErrorConnection } from ".";

const meta: Meta<typeof ErrorConnection> = {
  title: "Components/ErrorConnection",
  component: ErrorConnection,
};

export default meta;
type Story = StoryObj<typeof ErrorConnection>;

export const Default: Story = {
  args: {
    message: "Error message",
    description: "Error description",
  },
};
