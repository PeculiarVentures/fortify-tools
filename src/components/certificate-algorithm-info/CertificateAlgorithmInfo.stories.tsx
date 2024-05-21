import type { Meta, StoryObj } from "@storybook/react";
import { CertificateAlgorithmInfo } from "./CertificateAlgorithmInfo";
import {
  EHashAlgorithm,
  ESignatureAlgorithm,
} from "@peculiar/fortify-client-core";

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
