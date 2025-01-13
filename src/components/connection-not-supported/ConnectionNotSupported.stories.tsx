import type { Meta, StoryObj } from "@storybook/react";
import { ConnectionNotSupported } from "./ConnectionNotSupported";

const meta: Meta<typeof ConnectionNotSupported> = {
  title: "Components/ConnectionNotSupported",
  component: ConnectionNotSupported,
  tags: ["!autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConnectionNotSupported>;

export const Default: Story = {};
