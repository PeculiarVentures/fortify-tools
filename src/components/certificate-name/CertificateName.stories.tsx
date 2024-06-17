import type { Meta, StoryObj } from "@storybook/react";
import { CertificateName } from "./CertificateName";

const meta: Meta<typeof CertificateName> = {
  title: "Components/CertificateName",
  component: CertificateName,
};

export default meta;
type Story = StoryObj<typeof CertificateName>;

export const Default: Story = {
  args: {
    name: "Certificate name",
  },
};
