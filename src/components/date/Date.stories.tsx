import type { Meta, StoryObj } from "@storybook/react";
import { Date as DateComponent } from "./Date";

const meta: Meta<typeof DateComponent> = {
  title: "Components/Date",
  component: DateComponent,
};

export default meta;
type Story = StoryObj<typeof DateComponent>;

export const Default: Story = {
  args: {
    date: new Date(),
  },
};
