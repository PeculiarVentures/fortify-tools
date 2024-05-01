import type { Meta, StoryObj } from "@storybook/react";
import { CertificateDeleteButton } from "./CertificateDeleteButton";

const meta: Meta<typeof CertificateDeleteButton> = {
  title: "Components/CertificateDeleteButton",
  component: CertificateDeleteButton,
};

export default meta;
type Story = StoryObj<typeof CertificateDeleteButton>;

export const Default: Story = {};
