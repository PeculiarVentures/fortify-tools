import { render, userEvent, screen } from "@testing";
import { CertificateKeyPropertiesSelect } from "./CertificateKeyPropertiesSelect";

describe("<CertificateKeyPropertiesSelect />", () => {
  it("Should render", async () => {
    const signatureAlgorithm = [
      "RSA-2048",
      "RSA-4096",
      "EC-P256",
      "EC-P384",
      "EC-P521",
    ];
    const hashAlgorithm = ["SHA-256", "SHA-384", "SHA-512"];

    const { container } = render(
      <CertificateKeyPropertiesSelect className="test_class" />
    );

    expect(container.children[0]).toHaveClass("test_class");

    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes).toHaveLength(2);

    expect(comboboxes[0]).toHaveTextContent(signatureAlgorithm[2]);

    await userEvent.click(comboboxes[0]);

    const combobox0Popup = screen.getByRole("presentation");
    expect(combobox0Popup).toBeInTheDocument();

    const combobox0Items = screen.getAllByRole("option");
    expect(combobox0Items).toHaveLength(signatureAlgorithm.length);

    combobox0Items.forEach((item, index) => {
      expect(item).toHaveTextContent(signatureAlgorithm[index]);
    });

    await userEvent.click(combobox0Items[0]);

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    expect(comboboxes[1]).toHaveTextContent(hashAlgorithm[0]);

    await userEvent.click(comboboxes[1]);

    const combobox1Popup = screen.getByRole("presentation");
    expect(combobox1Popup).toBeInTheDocument();

    const combobox1Items = screen.getAllByRole("option");
    expect(combobox1Items).toHaveLength(hashAlgorithm.length);

    combobox1Items.forEach((item, index) => {
      expect(item).toHaveTextContent(hashAlgorithm[index]);
    });

    await userEvent.click(combobox1Items[0]);

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });
});
