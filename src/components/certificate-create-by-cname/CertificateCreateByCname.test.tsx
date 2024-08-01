import { describe, it, render, vi, expect, userEvent } from "@testing";
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

    const CNFieldElement = getByRole("textbox", {
      name: "Common name",
    });
    expect(CNFieldElement).toBeInTheDocument();

    const CNFieldValue = "company.com";
    await userEvent.type(CNFieldElement, CNFieldValue);
    expect(CNFieldElement).toHaveValue(CNFieldValue);

    expect(button).toBeEnabled();

    await userEvent.click(button);

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith({
      subject: { CN: CNFieldValue },
      algorithm: { hash: "SHA-256", signature: "RSA-2048" },
      type: "x509",
    });
  });
});
