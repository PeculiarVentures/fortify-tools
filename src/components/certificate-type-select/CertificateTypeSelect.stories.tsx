import type { Meta, StoryObj } from "@storybook/react";
import { CertificateTypeSelect } from "./CertificateTypeSelect";

const meta: Meta<typeof CertificateTypeSelect> = {
  title: "Components/CertificateTypeSelect",
  component: CertificateTypeSelect,
};

export default meta;
type Story = StoryObj<typeof CertificateTypeSelect>;

export const Default: Story = {};
