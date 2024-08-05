import { describe, it, render, expect, userEvent } from "@testing";
import { CertificateKeyPropertiesSelect } from "./CertificateKeyPropertiesSelect";

describe("<CertificateKeyPropertiesSelect />", () => {
  it("Should render", async () => {
    const { container, getAllByRole, queryByRole, getByRole } = render(
      <CertificateKeyPropertiesSelect className="test_class" />
    );

    expect(container.children[0]).toHaveClass("test_class");

    const comboboxes = getAllByRole("combobox");
    expect(comboboxes).toHaveLength(2);

    expect(comboboxes[0]).toHaveTextContent(/RSA-2048/);

    await userEvent.click(comboboxes[0]);

    const combobox0Popup = getByRole("presentation");
    expect(combobox0Popup).toBeInTheDocument();

    const combobox0Items = getAllByRole("option");
    expect(combobox0Items).toHaveLength(5);

    await userEvent.click(combobox0Items[0]);

    expect(queryByRole("presentation")).not.toBeInTheDocument();

    expect(comboboxes[1]).toHaveTextContent(/SHA-256/);

    await userEvent.click(comboboxes[1]);

    const combobox1Popup = getByRole("presentation");
    expect(combobox1Popup).toBeInTheDocument();

    const combobox1Items = getAllByRole("option");
    expect(combobox1Items).toHaveLength(3);

    await userEvent.click(combobox1Items[0]);

    expect(queryByRole("presentation")).not.toBeInTheDocument();
  });
});
