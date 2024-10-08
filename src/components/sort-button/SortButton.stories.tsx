import type { Meta, StoryObj } from "@storybook/react";
import { SortButton } from "./SortButton";

const meta: Meta<typeof SortButton> = {
  title: "Components/SortButton",
  component: SortButton,
};

export default meta;
type Story = StoryObj<typeof SortButton>;

export const Default: Story = {
  args: {
    children: "Name",
  },
};
