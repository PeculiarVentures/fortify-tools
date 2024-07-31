import type { Meta, StoryObj } from "@storybook/react";
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";
import { CertificateAlgorithmInfo } from "./CertificateAlgorithmInfo";

const meta: Meta<typeof CertificateAlgorithmInfo> = {
  title: "Components/CertificateAlgorithmInfo",
  component: CertificateAlgorithmInfo,
};

export default meta;
type Story = StoryObj<typeof CertificateAlgorithmInfo>;

export const Default: Story = {
  args: {
    algorithmSignature: ESignatureAlgorithm.RSA4096,
    algorithmHash: EHashAlgorithm.SHA_256,
  },
};
