import type { Meta, StoryObj } from "@storybook/react";
import { CertificateDeleteDialog } from "./CertificateDeleteDialog";

const meta: Meta<typeof CertificateDeleteDialog> = {
  title: "Components/CertificateDeleteDialog",
  component: CertificateDeleteDialog,
};

export default meta;
type Story = StoryObj<typeof CertificateDeleteDialog>;

export const Default: Story = {
  args: {
    certificateName: "Certificate Name",
    certificateId: "12345",
  },
};

export const Loading: Story = {
  args: {
    certificateName: "Certificate Name",
    certificateId: "12345",
    loading: true,
  },
};
