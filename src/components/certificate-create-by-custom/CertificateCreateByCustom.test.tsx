import { render, vi, userEvent, screen } from "@testing";
import { CertificateCreateByCustom } from "./CertificateCreateByCustom";

describe("<CertificateCreateByCustom />", () => {
  it("Should render & submit", async () => {
    const createDataResult = {
      subject: {
        CN: "company.com",
        E: "info@company.com",
        O: "Company",
        OU: "Company unit",
        L: "New York",
        ST: "Albany County",
        C: "US",
      },
      extendedKeyUsages: ["1.3.6.1.5.5.7.3.3"],
      algorithm: {
        hash: "SHA-512",
        signature: "EC-P521",
      },
      type: "x509",
    };
    const onCreateButtonClickMock = vi.fn((data) => data);

    render(
      <CertificateCreateByCustom
        type="x509"
        onCreateButtonClick={onCreateButtonClickMock}
      />
    );

    // Subject section

    expect(screen.getByText("Subject")).toBeInTheDocument();

    const buttonElement = screen.getByRole("button", {
      name: "Create certificate",
    });
    expect(buttonElement).toBeDisabled();

    // Common name

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Common name",
      }),
      createDataResult.subject.CN
    );

    expect(buttonElement).toBeDisabled();

    // Email

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Email address",
      }),
      createDataResult.subject.E
    );

    expect(buttonElement).toBeEnabled();

    // Organization

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Organization",
      }),
      createDataResult.subject.O
    );

    // Organization unit

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Organization unit",
      }),
      createDataResult.subject.OU
    );

    // Country

    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Country",
      })
    );

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(screen.getByText("United States"));

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    // Locality

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Locality",
      }),
      createDataResult.subject.L
    );

    // State

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "State",
      }),
      createDataResult.subject.ST
    );

    // Extended key usages section

    expect(screen.getByText("Extended key usages")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Code signing"));

    // Key properties

    expect(screen.getByText("Key properties")).toBeInTheDocument();

    // Signature Algorithm

    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Signature Algorithm",
      })
    );

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(screen.getByText("EC-P521"));

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    // Hash Algorithm

    await userEvent.click(
      screen.getByRole("combobox", {
        name: "Hash Algorithm",
      })
    );

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(screen.getByText("SHA-512"));

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    await userEvent.click(buttonElement);

    expect(onCreateButtonClickMock).toBeCalledTimes(1);
    expect(onCreateButtonClickMock).toHaveReturnedWith(createDataResult);
  });

  it("Should render CSR type", async () => {
    render(
      <CertificateCreateByCustom type="csr" onCreateButtonClick={vi.fn()} />
    );

    expect(screen.queryByText("Extended key usages")).not.toBeInTheDocument();
  });
});
