import { render, vi, userEvent, screen } from "@testing";
import { CertificateCreateDialog } from "./CertificateCreateDialog";

describe("<CertificateCreateDialog />", () => {
  const algorithm = { hash: "SHA-256", signature: "EC-P256" };

  async function selectType(selectedIndex: number) {
    const combobox = screen.getAllByRole("combobox")[1];
    expect(combobox).toHaveTextContent("Select type");

    await userEvent.click(combobox);

    expect(screen.getAllByRole("presentation")[1]).toBeInTheDocument();

    const comboboxItems = screen.getAllByRole("option");
    expect(comboboxItems).toHaveLength(6);

    await userEvent.click(comboboxItems[selectedIndex]);

    expect(screen.getAllByRole("presentation")).toHaveLength(1);
  }

  async function clickCreateButton() {
    const button = screen.getByRole("button", { name: "Create certificate" });
    expect(button).toBeEnabled();
    await userEvent.click(button);
  }

  async function fillField(name: string, fieldValue: string) {
    await userEvent.type(
      screen.getByRole("textbox", {
        name,
      }),
      fieldValue
    );
  }

  it("Should handle close button", async () => {
    const onCloseButtonClickMock = vi.fn();

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={onCloseButtonClickMock}
        onCreateButtonClick={vi.fn()}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    expect(onCloseButtonClickMock).toBeCalledTimes(1);
  });

  it("Should handle provider select", async () => {
    const onProviderSelectMock = vi.fn((data) => data);

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

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={vi.fn()}
        onProviderSelect={onProviderSelectMock}
        providers={providers}
        currentProviderId={providers[0].id}
      />
    );

    const combobox = screen.getAllByRole("combobox")[0];
    expect(combobox).toHaveTextContent(providers[0].name);

    await userEvent.click(combobox);

    expect(screen.getAllByRole("presentation")[1]).toBeInTheDocument();

    const comboboxItems = screen.getAllByRole("option");
    expect(comboboxItems).toHaveLength(2);

    await userEvent.click(comboboxItems[1]);

    expect(screen.getAllByRole("presentation")).toHaveLength(1);

    expect(onProviderSelectMock).toBeCalledTimes(1);
    expect(onProviderSelectMock).toHaveReturnedWith(providers[1].id);
  });

  it("Should select type with 'Common name' & submit", async () => {
    const createDataResult = {
      subject: { CN: "example.com" },
      algorithm,
      extendedKeyUsages: ["1.3.6.1.5.5.7.3.1"],
      type: "x509",
    };
    const onCreateButtonClickMock = vi.fn((data) => data);

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={onCreateButtonClickMock}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    await selectType(4);

    await fillField("Common name", createDataResult.subject.CN);

    await clickCreateButton();

    expect(onCreateButtonClickMock).toBeCalledTimes(1);
    expect(onCreateButtonClickMock).toHaveReturnedWith(createDataResult);
  });

  it("Should select type with 'Email' & submit", async () => {
    const emailValue = "info@company.com";
    const createDataResult = {
      subject: { CN: emailValue, E: emailValue },
      algorithm,
      extendedKeyUsages: ["1.3.6.1.5.5.7.3.4", "1.3.6.1.5.5.7.3.2"],
      type: "x509",
    };
    const onCreateButtonClickMock = vi.fn((data) => data);

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={onCreateButtonClickMock}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    await selectType(0);

    await fillField("Email address", createDataResult.subject.E);

    await clickCreateButton();

    expect(onCreateButtonClickMock).toBeCalledTimes(1);
    expect(onCreateButtonClickMock).toHaveReturnedWith(createDataResult);
  });

  it("Should select type with 'Custom' & submit", async () => {
    const createDataResult = {
      subject: {
        CN: "example.com",
        E: "info@company.com",
        O: "",
        OU: "",
        L: "",
        ST: "",
        C: "",
      },
      algorithm,
      extendedKeyUsages: [],
      type: "x509",
    };
    const onCreateButtonClickMock = vi.fn((data) => data);

    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={onCreateButtonClickMock}
        onProviderSelect={vi.fn()}
        providers={[]}
      />
    );

    await selectType(5);

    await fillField("Common name", createDataResult.subject.CN);

    await fillField("Email address", createDataResult.subject.E);

    await clickCreateButton();

    expect(onCreateButtonClickMock).toBeCalledTimes(1);
    expect(onCreateButtonClickMock).toHaveReturnedWith(createDataResult);
  });

  it("Should render loading", () => {
    render(
      <CertificateCreateDialog
        type="x509"
        onDialogClose={vi.fn()}
        onCreateButtonClick={vi.fn()}
        onProviderSelect={vi.fn()}
        providers={[]}
        loading={true}
      />
    );

    expect(screen.getByText(/Creating certificate/)).toBeInTheDocument();
  });
});
