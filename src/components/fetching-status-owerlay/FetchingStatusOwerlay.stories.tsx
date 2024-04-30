import type { Meta, StoryObj } from "@storybook/react";
import { FetchingStatusOwerlay } from "./FetchingStatusOwerlay";

const meta: Meta<typeof FetchingStatusOwerlay> = {
  title: "Components/FetchingStatusOwerlay",
  component: FetchingStatusOwerlay,
};

export default meta;
type Story = StoryObj<typeof FetchingStatusOwerlay>;

export const Default: Story = {
  args: {
    fetching: {},
  },
};

export const UpdateClient: Story = {
  args: {
    fetching: {
      connectionClientUpdate: "rejected",
    },
  },
};

export const ConnectionNotSupported: Story = {
  args: {
    fetching: {
      connectionSupport: "rejected",
    },
  },
};

export const ConnectionNotDetected: Story = {
  args: {
    fetching: {
      connectionDetect: "rejected",
    },
  },
};

export const ConnectionNotApproved: Story = {
  args: {
    fetching: {
      connectionApprove: "rejected",
    },
  },
};

export const ConnectionApprove: Story = {
  args: {
    fetching: {
      connectionApprove: "pending",
    },
    challenge: "12345",
  },
};
