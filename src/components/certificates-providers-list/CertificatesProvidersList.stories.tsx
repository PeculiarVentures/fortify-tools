import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CertificatesProvidersList } from "./CertificatesProvidersList";

const meta: Meta<typeof CertificatesProvidersList> = {
  title: "Components/CertificatesProvidersList",
  component: CertificatesProvidersList,
};

export default meta;
type Story = StoryObj<typeof CertificatesProvidersList>;

export const Default: Story = {
  args: {
    currentProviderId: "1",
    providers: [
      {
        id: "1",
        name: "Provider 1",
        isRemovable: false,
        readOnly: true,
      },
      {
        id: "2",
        name: "Provider 2",
        isRemovable: false,
        readOnly: true,
      },
      {
        id: "3",
        name: "Smartcard",
        isRemovable: true,
        readOnly: true,
      },
    ],
    onSelect: fn(),
  },
};
