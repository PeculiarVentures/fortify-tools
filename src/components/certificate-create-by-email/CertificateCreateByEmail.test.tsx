import { render, vi, userEvent, screen } from "@testing";
import { CertificateCreateByEmail } from "./CertificateCreateByEmail";

describe("<CertificateCreateByEmail />", () => {
  it("Should render & submit", async () => {
    const emailValue = "info@company.com";
    const createDataResult = {
      subject: { CN: emailValue, E: emailValue },
      algorithm: { hash: "SHA-256", signature: "RSA-2048" },
      type: "x509",
    };
    const onCreateButtonClickMock = vi.fn((data) => data);

    render(
      <CertificateCreateByEmail
        type="x509"
        onCreateButtonClick={onCreateButtonClickMock}
      />
    );

    const buttonElement = screen.getByRole("button", {
      name: "Create certificate",
    });
    expect(buttonElement).toBeDisabled();

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Email address",
      }),
      createDataResult.subject.E
    );

    await userEvent.click(buttonElement);

    expect(onCreateButtonClickMock).toBeCalledTimes(1);
    expect(onCreateButtonClickMock).toHaveReturnedWith(createDataResult);
  });

  it("Should validate incorrect email", async () => {
    render(
      <CertificateCreateByEmail type="x509" onCreateButtonClick={vi.fn()} />
    );

    const buttonElement = screen.getByRole("button", {
      name: "Create certificate",
    });
    expect(buttonElement).toBeDisabled();

    await userEvent.type(
      screen.getByRole("textbox", {
        name: "Email address",
      }),
      "company"
    );

    expect(
      screen.getByText("Please enter valid email address")
    ).toBeInTheDocument();

    expect(buttonElement).toBeDisabled();
  });
});
