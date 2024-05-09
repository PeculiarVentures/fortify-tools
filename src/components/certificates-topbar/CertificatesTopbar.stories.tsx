import type { Meta, StoryObj } from "@storybook/react";
import { CertificatesTopbar } from "./CertificatesTopbar";

const meta: Meta<typeof CertificatesTopbar> = {
  title: "Components/CertificatesTopbar",
  component: CertificatesTopbar,
};

export default meta;
type Story = StoryObj<typeof CertificatesTopbar>;

export const Default: Story = {};
