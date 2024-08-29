import type { Meta, StoryObj } from "@storybook/react";
import { ConnectionNotDetected } from "./ConnectionNotDetected";

const meta: Meta<typeof ConnectionNotDetected> = {
  title: "Components/FetchingStatusOwerlay/ConnectionNotDetected",
  component: ConnectionNotDetected,
};

export default meta;
type Story = StoryObj<typeof ConnectionNotDetected>;

export const Default: Story = {};
