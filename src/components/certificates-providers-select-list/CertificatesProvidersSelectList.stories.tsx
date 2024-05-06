import type { Meta, StoryObj } from "@storybook/react";
import { CertificatesProvidersSelectList } from "./CertificatesProvidersSelectList";

const meta: Meta<typeof CertificatesProvidersSelectList> = {
  title: "Components/CertificatesProvidersSelectList",
  component: CertificatesProvidersSelectList,
};

export default meta;
type Story = StoryObj<typeof CertificatesProvidersSelectList>;

export const Default: Story = {
  args: {
    currentProviderId: "2",
    providers: [
      {
        id: "1",
        name: "Provider 1",
      },
      {
        id: "2",
        name: "Provider 2",
      },
    ],
    onSelect: () => {},
  },
};

export const Empty: Story = {
  args: {
    providers: [],
  },
};
