import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CertificateCreateDialog } from "./CertificateCreateDialog";

const meta: Meta<typeof CertificateCreateDialog> = {
  title: "Components/CertificateCreateDialog",
  component: CertificateCreateDialog,
};

export default meta;
type Story = StoryObj<typeof CertificateCreateDialog>;

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
    onCreateButtonClick: fn(),
  },
};

export const isLoading: Story = {
  args: {
    loading: true,
    providers,
    onProviderSelect: fn(),
  },
};
