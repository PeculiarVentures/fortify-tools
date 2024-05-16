import type { Meta, StoryObj } from "@storybook/react";
import { CertificateAlgorithmInfo } from "./CertificateAlgorithmInfo";

const meta: Meta<typeof CertificateAlgorithmInfo> = {
  title: "Components/CertificateAlgorithmInfo",
  component: CertificateAlgorithmInfo,
};

export default meta;
type Story = StoryObj<typeof CertificateAlgorithmInfo>;

export const Default: Story = {
  args: {
    algorithmNname: "RSASSA-PKCS1-v1_5",
    algorithmModulusLength: 2048,
  },
};
