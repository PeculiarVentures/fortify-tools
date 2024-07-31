import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AppFallback } from "./AppFallback";

const meta: Meta<typeof AppFallback> = {
  title: "Components/AppFallback",
  component: AppFallback,
};

export default meta;
type Story = StoryObj<typeof AppFallback>;

export const Default: Story = {
  args: {
    resetErrorBoundary: fn(),
  },
};
