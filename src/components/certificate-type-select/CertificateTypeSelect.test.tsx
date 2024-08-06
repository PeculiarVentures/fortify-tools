import { render, vi, userEvent } from "@testing";
import { CertificateTypeSelect } from "./CertificateTypeSelect";

describe("<CertificateTypeSelect />", () => {
  const items = [
    "S/MIME",
    "Code signing",
    "Document signing",
    "TLS Client Authentication",
    "TLS Server Authentication",
  ];

  it("Should render for x509 & handel change", async () => {
    const handleChange = vi.fn();
    const itemsX509 = [...items, "Custom certificate"];

    const { getByRole, getAllByRole, queryByRole } = render(
      <CertificateTypeSelect
        onChange={handleChange}
        className="test_combobox"
        type="x509"
      />
    );

    const combobox = getByRole("combobox");
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveTextContent(/Select type/);
    expect(combobox.parentElement).toHaveClass("test_combobox");

    await userEvent.click(combobox);

    const comboboxPopup = getByRole("presentation");
    expect(comboboxPopup).toBeInTheDocument();

    const comboboxItems = getAllByRole("option");
    expect(comboboxItems).toHaveLength(itemsX509.length);

    comboboxItems.forEach((item, index) => {
      expect(item).toHaveTextContent(itemsX509[index]);
    });

    await userEvent.click(comboboxItems[0]);

    expect(queryByRole("presentation")).not.toBeInTheDocument();

    expect(handleChange).toBeCalledTimes(1);
  });

  it("Should render for CSR & handel change", async () => {
    const handleChange = vi.fn();
    const itemsCSR = [...items, "Custom CSR"];

    const { getByRole, getAllByRole, queryByRole } = render(
      <CertificateTypeSelect onChange={handleChange} type="csr" />
    );

    const combobox = getByRole("combobox");
    expect(combobox).toBeInTheDocument();

    await userEvent.click(combobox);

    const comboboxPopup = getByRole("presentation");
    expect(comboboxPopup).toBeInTheDocument();

    const comboboxItems = getAllByRole("option");

    expect(comboboxItems).toHaveLength(itemsCSR.length);

    comboboxItems.forEach((item, index) => {
      expect(item).toHaveTextContent(itemsCSR[index]);
    });

    await userEvent.click(comboboxItems[0]);

    expect(queryByRole("presentation")).not.toBeInTheDocument();

    expect(handleChange).toBeCalledTimes(1);
  });
});
