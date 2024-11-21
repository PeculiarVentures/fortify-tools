import { render, userEvent, screen } from "@testing";
import { CertificateViewerDialog } from "./CertificateViewerDialog";
import { CertificateProps } from "../../types";

vi.mock("@peculiar/certificates-viewer-react", () => ({
  PeculiarCertificateViewer: () => "x509 certificate viewer component",
  PeculiarCsrViewer: () => "CSR certificate viewer component",
}));

describe("<CertificateViewerDialog />", () => {
  const certificates = [
    {
      raw: new ArrayBuffer(0),
      subjectName: "Certificate name 1",
      type: "x509",
      label: "Certificate name 1",
      subject: {
        commonName: "Certificate name 1",
      },
    },
    {
      raw: new ArrayBuffer(0),
      subjectName: "Certificate name 2",
      type: "x509",
      label: "Certificate name 2",
      subject: {
        commonName: "Certificate name 2",
      },
    },
  ] as unknown as CertificateProps[];

  it("Should render as x509 and handle close", async () => {
    const onCloseMock = vi.fn();

    render(
      <CertificateViewerDialog
        certificates={[certificates[0]]}
        onClose={onCloseMock}
      />
    );

    expect(
      screen.getByText(`“${certificates[0].label}” details`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/x509 certificate viewer component/)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Close/ }));

    expect(onCloseMock).toBeCalledTimes(1);
  });

  it("Should render & switches tabs", async () => {
    render(
      <CertificateViewerDialog certificates={certificates} onClose={vi.fn()} />
    );

    expect(
      screen.getByText(`${certificates[0].label}`).closest("button")
    ).toHaveAttribute("aria-selected", "true");

    await userEvent.click(screen.getByText(`${certificates[1].label}`));

    expect(
      screen.getByText(`${certificates[1].label}`).closest("button")
    ).toHaveAttribute("aria-selected", "true");
  });

  it("Should render as CSR", () => {
    render(
      <CertificateViewerDialog
        certificates={[
          { ...certificates[0], type: "csr" } as unknown as CertificateProps,
        ]}
        onClose={vi.fn()}
      />
    );
    expect(
      screen.getByText(/CSR certificate viewer component/)
    ).toBeInTheDocument();
  });
});
