import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CertificateImportDialog } from "./CertificateImportDialog";

const meta: Meta<typeof CertificateImportDialog> = {
  title: "Components/CertificateImportDialog",
  component: CertificateImportDialog,
};

export default meta;
type Story = StoryObj<typeof CertificateImportDialog>;

const providers = [
  {
    id: "1",
    name: "Provider 1",
  },
  {
    id: "2",
    name: "Provider 2",
  },
];

export const Default: Story = {
  args: {
    currentProviderId: "2",
    providers,
    onProviderSelect: fn(),
    onTextAreaChange: fn(),
  },
};

export const isLoading: Story = {
  args: {
    loading: true,
    providers,
    onProviderSelect: fn(),
  },
};
