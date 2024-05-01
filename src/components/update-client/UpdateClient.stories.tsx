import type { Meta, StoryObj } from "@storybook/react";
import { UpdateClient } from "./UpdateClient";

const meta: Meta<typeof UpdateClient> = {
  title: "Components/FetchingStatusOwerlay/UpdateClient",
  component: UpdateClient,
};

export default meta;
type Story = StoryObj<typeof UpdateClient>;

export const Default: Story = {};
