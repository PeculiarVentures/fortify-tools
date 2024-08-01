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

    const EmailFieldElement = getByRole("textbox", {
      name: "Email address",
    });
    expect(EmailFieldElement).toBeInTheDocument();

    const EmailFieldValue = "info@company.com";
    await userEvent.type(EmailFieldElement, EmailFieldValue);
    expect(EmailFieldElement).toHaveValue(EmailFieldValue);

    expect(button).toBeEnabled();

    await userEvent.click(button);

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: { CN: EmailFieldValue, E: EmailFieldValue },
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

    const EmailFieldElement = getByRole("textbox", {
      name: "Email address",
    });

    const EmailFieldValue = "company";
    await userEvent.type(EmailFieldElement, EmailFieldValue);
    expect(EmailFieldElement).toHaveValue(EmailFieldValue);

    expect(getByText("Please enter valid email address")).toBeInTheDocument();

    expect(button).toBeDisabled();
  });
});
