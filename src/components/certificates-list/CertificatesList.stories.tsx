import type { Meta, StoryObj } from "@storybook/react";
import { CertificatesList } from "./CertificatesList";
import { faker } from "@faker-js/faker";

const meta: Meta<typeof CertificatesList> = {
  title: "Components/CertificatesList",
  component: CertificatesList,
};

export default meta;
type Story = StoryObj<typeof CertificatesList>;

export const Default: Story = {
  args: {
    certificates: Array.from(Array(10)).map(() => ({
      index: faker.string.uuid(),
      issuerName: "",
      notAfter: faker.date.future(),
      notBefore: faker.date.past(),
      providerID: faker.string.uuid(),
      publicKey: "" as unknown as CryptoKey,
      raw: new ArrayBuffer(0),
      serialNumber: faker.string.uuid(),
      subjectName: "",
      type: "x509",
      id: faker.string.uuid(),
      label: faker.internet.domainName(),
      privateKeyId: "",
      subject: {
        commonName: "",
      },
    })),
  },
};

export const Empty: Story = {
  args: {
    certificates: [],
  },
};
