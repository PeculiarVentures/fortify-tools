import { render, vi, userEvent } from "@testing";
import { CertificateCreateByCname } from "./CertificateCreateByCname";

describe("<CertificateCreateByCname />", () => {
  it("Should render & submit", async () => {
    const handleCreate = vi.fn((data) => data);

    const { getByRole } = render(
      <CertificateCreateByCname
        type="x509"
        onCreateButtonClick={handleCreate}
      />
    );

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    const cnFieldElement = getByRole("textbox", {
      name: "Common name",
    });
    expect(cnFieldElement).toBeInTheDocument();
    expect(cnFieldElement).toHaveAttribute("placeholder", "company.com");

    const cnFieldValue = "example.com";
    await userEvent.type(cnFieldElement, cnFieldValue);
    expect(cnFieldElement).toHaveValue(cnFieldValue);

    expect(button).toBeEnabled();

    await userEvent.click(button);

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: { CN: cnFieldValue },
      algorithm: { hash: "SHA-256", signature: "RSA-2048" },
      type: "x509",
    });
  });
});
