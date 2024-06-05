import type { Meta, StoryObj } from "@storybook/react";
import { KeyUsagesCheckboxGroup } from "./KeyUsagesCheckboxGroup";

const meta: Meta<typeof KeyUsagesCheckboxGroup> = {
  title: "Components/KeyUsagesCheckboxGroup",
  component: KeyUsagesCheckboxGroup,
};

export default meta;
type Story = StoryObj<typeof KeyUsagesCheckboxGroup>;

export const Default: Story = {};
