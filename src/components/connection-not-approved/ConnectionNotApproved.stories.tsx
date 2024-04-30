import type { Meta, StoryObj } from "@storybook/react";
import { ConnectionNotApproved } from "./ConnectionNotApproved";

const meta: Meta<typeof ConnectionNotApproved> = {
  title: "Components/FetchingStatusOwerlay/ConnectionNotApproved",
  component: ConnectionNotApproved,
};

export default meta;
type Story = StoryObj<typeof ConnectionNotApproved>;

export const Default: Story = {};
