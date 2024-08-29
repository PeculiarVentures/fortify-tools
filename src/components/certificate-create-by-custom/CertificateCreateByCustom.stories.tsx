import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CertificateCreateByCustom } from "./CertificateCreateByCustom";

const meta: Meta<typeof CertificateCreateByCustom> = {
  title: "Components/CertificateCreateByCustom",
  component: CertificateCreateByCustom,
};

export default meta;
type Story = StoryObj<typeof CertificateCreateByCustom>;

export const Default: Story = {
  args: {
    onCreateButtonClick: fn(),
  },
};
