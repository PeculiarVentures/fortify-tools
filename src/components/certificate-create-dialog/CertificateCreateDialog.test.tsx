import { render, vi, userEvent, screen } from "@testing";
import { CertificateCreateDialog } from "./CertificateCreateDialog";

describe("<CertificateCreateDialog />", () => {
  const algorithm = { hash: "SHA-256", signature: "RSA-2048" };

  async function selectType(selectedIndex: number) {
    const { getAllByRole } = screen;
    const combobox = getAllByRole("combobox")[1];
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveTextContent("Select type");

    await userEvent.click(combobox);

    const comboboxPopup = getAllByRole("presentation")[1];
    expect(comboboxPopup).toBeInTheDocument();

    const comboboxItems = getAllByRole("option");
    expect(comboboxItems).toHaveLength(6);

    await userEvent.click(comboboxItems[selectedIndex]);

    expect(getAllByRole("presentation")).toHaveLength(1);
  }

  async function clickCreateButton() {
    const { getByRole } = screen;
    const button = getByRole("button", { name: "Create certificate" });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();

    await userEvent.click(button);
  }

  async function fillField(name: string, fieldValue: string) {
    const { getByRole } = screen;
    const cnFieldElement = getByRole("textbox", {
      name,
    });
    expect(cnFieldElement).toBeInTheDocument();

    await userEvent.type(cnFieldElement, fieldValue);
    expect(cnFieldElement).toHaveValue(fieldValue);
  }

  it("Should handle close button", async () => {
    const handleClose = vi.fn();

    const { getByRole } = render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={handleClose}
        onCreateButtonClick={vi.fn()}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    expect(handleClose).toBeCalledTimes(1);
  });

  it("Should handle provider select", async () => {
    const handleProviderSelect = vi.fn((data) => data);

    const providers = [
      {
        id: "1",
        name: "Provider 1",
      },
      {
        id: "2",
        name: "Provider 2",
      },
    ];

    const { getAllByRole } = render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={vi.fn()}
        onProviderSelect={handleProviderSelect}
        providers={providers}
        currentProviderId={providers[0].id}
      />
    );

    const combobox = getAllByRole("combobox")[0];
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveTextContent(providers[0].name);

    await userEvent.click(combobox);

    const comboboxPopup = getAllByRole("presentation")[1];
    expect(comboboxPopup).toBeInTheDocument();

    const comboboxItems = getAllByRole("option");
    expect(comboboxItems).toHaveLength(2);

    await userEvent.click(comboboxItems[1]);

    expect(getAllByRole("presentation")).toHaveLength(1);

    expect(handleProviderSelect).toBeCalledTimes(1);
    expect(handleProviderSelect).toHaveReturnedWith(providers[1].id);
  });

  it("Should select type with 'Common name' & submit", async () => {
    const handleCreate = vi.fn((data) => data);

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={handleCreate}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    await selectType(4);

    const cnFieldValue = "example.com";
    await fillField("Common name", cnFieldValue);

    await clickCreateButton();

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: { CN: cnFieldValue },
      algorithm,
      type: "x509",
    });
  });

  it("Should select type with 'Email' & submit", async () => {
    const handleCreate = vi.fn((data) => data);

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={handleCreate}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    await selectType(0);

    const emailFieldValue = "info@company.com";
    await fillField("Email address", emailFieldValue);

    await clickCreateButton();

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: { CN: emailFieldValue, E: emailFieldValue },
      algorithm,
      type: "x509",
    });
  });

  it("Should select type with 'Custom' & submit", async () => {
    const handleCreate = vi.fn((data) => data);

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={handleCreate}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    await selectType(5);

    const cnFieldValue = "example.com";
    await fillField("Common name", cnFieldValue);

    const emailFieldValue = "info@company.com";
    await fillField("Email address", emailFieldValue);

    await clickCreateButton();

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: {
        CN: cnFieldValue,
        E: emailFieldValue,
        O: "",
        OU: "",
        L: "",
        ST: "",
        C: "",
      },
      algorithm,
      extendedKeyUsages: [],
      type: "x509",
    });
  });

  it("Should render loading", () => {
    const { getByText } = render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={vi.fn()}
        onProviderSelect={vi.fn()}
        providers={[]}
        loading={true}
      />
    );

    expect(getByText(/Creating certificate/)).toBeInTheDocument();
  });
});
