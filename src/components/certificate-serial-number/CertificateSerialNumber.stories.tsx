import type { Meta, StoryObj } from "@storybook/react";
import { CertificateSerialNumber } from "./CertificateSerialNumber";

const meta: Meta<typeof CertificateSerialNumber> = {
  title: "Components/CertificateSerialNumber",
  component: CertificateSerialNumber,
};

export default meta;
type Story = StoryObj<typeof CertificateSerialNumber>;

export const Default: Story = {
  args: {
    value: "nd84ifbhsl85ncfm975nn",
  },
};
