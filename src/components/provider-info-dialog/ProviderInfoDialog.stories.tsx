import type { Meta, StoryObj } from "@storybook/react";
import { ProviderInfoDialog } from "./ProviderInfoDialog";
import type { IProviderInfo } from "@peculiar/fortify-client-core";

const meta: Meta<typeof ProviderInfoDialog> = {
  title: "Components/ProviderInfoDialog",
  component: ProviderInfoDialog,
};

export default meta;
type Story = StoryObj<typeof ProviderInfoDialog>;

export const Default: Story = {
  args: {
    data: {
      name: "MacOS Crypto",
      version: 0,
      isHardware: true,
      token: {
        label: "MacOS Crypto",
        firmwareVersion: {
          major: 0,
          minor: 1,
          version: 0,
        },
        flags: 1064,
        freePrivateMemory: 18446744073709552000,
        freePublicMemory: 18446744073709552000,
        hardwareVersion: {
          major: 0,
          minor: 1,
          version: 0,
        },
        manufacturerID: "Peculiar Ventures",
        maxPinLen: 255,
        maxRwSessionCount: 0,
        maxSessionCount: 0,
        minPinLen: 4,
        model: "MacOS Crypto",
        rwSessionCount: 0,
        serialNumber: "1",
        sessionCount: 0,
        totalPrivateMemory: 18446744073709552000,
        totalPublicMemory: 18446744073709552000,
        version: 0,
      },
    } as IProviderInfo,
  },
};
