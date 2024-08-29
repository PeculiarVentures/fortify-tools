import type { Meta, StoryObj } from "@storybook/react";
import { ApproveConnection } from "./ApproveConnection";

const meta: Meta<typeof ApproveConnection> = {
  title: "Components/FetchingStatusOwerlay/ApproveConnection",
  component: ApproveConnection,
};

export default meta;
type Story = StoryObj<typeof ApproveConnection>;

export const Default: Story = {
  args: {
    challenge: "12345",
  },
};
