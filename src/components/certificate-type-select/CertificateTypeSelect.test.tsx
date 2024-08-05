import { render, vi, userEvent, cleanup, afterEach } from "@testing";
import { CertificateTypeSelect } from "./CertificateTypeSelect";

afterEach(cleanup);

describe("<CertificateTypeSelect />", () => {
  it("Should render for x509 & handel change", async () => {
    const handleChange = vi.fn((data) => data);

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
    expect(comboboxItems).toHaveLength(6);

    expect(comboboxItems[5]).toHaveTextContent(/Custom certificate/);

    await userEvent.click(comboboxItems[5]);

    expect(queryByRole("presentation")).not.toBeInTheDocument();

    expect(handleChange).toBeCalledTimes(1);
    expect(handleChange).toHaveReturnedWith({
      label: "Custom certificate",
      value: "custom",
    });
  });

  it("Should render for CSR & handel change", async () => {
    const handleChange = vi.fn((data) => data);

    const { getByRole, getAllByRole, queryByRole } = render(
      <CertificateTypeSelect onChange={handleChange} type="csr" />
    );

    const combobox = getByRole("combobox");
    expect(combobox).toBeInTheDocument();

    await userEvent.click(combobox);

    const comboboxPopup = getByRole("presentation");
    expect(comboboxPopup).toBeInTheDocument();

    const comboboxItems = getAllByRole("option");

    expect(comboboxItems[5]).toHaveTextContent(/Custom CSR/);

    await userEvent.click(comboboxItems[5]);

    expect(queryByRole("presentation")).not.toBeInTheDocument();

    expect(handleChange).toBeCalledTimes(1);
    expect(handleChange).toHaveReturnedWith({
      label: "Custom CSR",
      value: "custom",
    });
  });
});
