import type { Meta, StoryObj } from "@storybook/react";
import { CertificatesSidebar } from "./CertificatesSidebar";

const meta: Meta<typeof CertificatesSidebar> = {
  title: "Components/CertificatesSidebar",
  component: CertificatesSidebar,
};

export default meta;
type Story = StoryObj<typeof CertificatesSidebar>;

export const Default: Story = {
  args: {
    children: "",
  },
};
