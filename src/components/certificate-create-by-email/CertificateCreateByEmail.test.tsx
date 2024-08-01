import {
  describe,
  it,
  render,
  vi,
  expect,
  userEvent,
  afterEach,
  cleanup,
} from "@testing";
import { CertificateCreateByEmail } from "./CertificateCreateByEmail";

afterEach(cleanup);

describe("<CertificateCreateByEmail />", () => {
  it("Should render & submit", async () => {
    const handleCreate = vi.fn((data) => data);

    const { getByRole } = render(
      <CertificateCreateByEmail
        type="x509"
        onCreateButtonClick={handleCreate}
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const emailFieldElement = getByRole("textbox", {
      name: "Email address",
    });
    expect(emailFieldElement).toBeInTheDocument();
    expect(emailFieldElement).toHaveAttribute(
      "placeholder",
      "company@example.com"
    );

    const emailFieldValue = "info@company.com";
    await userEvent.type(emailFieldElement, emailFieldValue);
    expect(emailFieldElement).toHaveValue(emailFieldValue);

    expect(button).toBeEnabled();

    await userEvent.click(button);

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: { CN: emailFieldValue, E: emailFieldValue },
      algorithm: { hash: "SHA-256", signature: "RSA-2048" },
      type: "x509",
    });
  });

  it("Should validate incorrect email", async () => {
    const { getByRole, getByText } = render(
      <CertificateCreateByEmail type="x509" onCreateButtonClick={vi.fn()} />
    );

    const button = getByRole("button");
    expect(button).toBeDisabled();

    const emailFieldElement = getByRole("textbox", {
      name: "Email address",
    });

    const emailFieldValue = "company";
    await userEvent.type(emailFieldElement, emailFieldValue);
    expect(emailFieldElement).toHaveValue(emailFieldValue);

    expect(getByText("Please enter valid email address")).toBeInTheDocument();

    expect(button).toBeDisabled();
  });
});
