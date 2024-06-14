import type { Meta, StoryObj } from "@storybook/react";
import { CertificateTypeLabel } from "./CertificateTypeLabel";

const meta: Meta<typeof CertificateTypeLabel> = {
  title: "Components/CertificateTypeLabel",
  component: CertificateTypeLabel,
};

export default meta;
type Story = StoryObj<typeof CertificateTypeLabel>;

export const Default: Story = {
  args: {
    type: "x509",
  },
};
