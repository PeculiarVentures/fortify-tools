import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CertificateCreateByEmail } from "./CertificateCreateByEmail";

const meta: Meta<typeof CertificateCreateByEmail> = {
  title: "Components/CertificateCreateByEmail",
  component: CertificateCreateByEmail,
};

export default meta;
type Story = StoryObj<typeof CertificateCreateByEmail>;

export const Default: Story = {
  args: {
    onCreateButtonClick: fn(),
  },
};
