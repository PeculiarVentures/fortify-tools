import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CertificateCreateByCname } from "./CertificateCreateByCname";

const meta: Meta<typeof CertificateCreateByCname> = {
  title: "Components/CertificateCreateByCname",
  component: CertificateCreateByCname,
};

export default meta;
type Story = StoryObj<typeof CertificateCreateByCname>;

export const Default: Story = {
  args: {
    onCreateButtonClick: fn(),
  },
};
