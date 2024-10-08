import type { Meta, StoryObj } from "@storybook/react";
import { CertificateKeyPropertiesSelect } from "./CertificateKeyPropertiesSelect";

const meta: Meta<typeof CertificateKeyPropertiesSelect> = {
  title: "Components/CertificateKeyPropertiesSelect",
  component: CertificateKeyPropertiesSelect,
};

export default meta;
type Story = StoryObj<typeof CertificateKeyPropertiesSelect>;

export const Default: Story = {};
