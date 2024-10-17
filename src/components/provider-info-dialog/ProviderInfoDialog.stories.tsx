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
      isHardware: true,
      isRemovable: true,
      token: {
        label: "MacOS Crypto",
        serialNumber: "1",
        freePrivateMemory: 18446,
        // freePrivateMemory: 18446744073709552000,
        hardwareVersion: {
          major: 0,
          minor: 1,
          version: 0,
        },
        firmwareVersion: {
          major: 0,
          minor: 1,
          version: 0,
        },
        model: "MacOS Crypto",
      },
      algorithms: ["SHA-1", "SHA-256", "SHA-384"],
    } as IProviderInfo,
  },
};
