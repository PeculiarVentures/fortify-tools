import { render, userEvent, screen } from "@testing";
import { CertificateViewerDialog } from "./CertificateViewerDialog";
import { CertificateProps } from "../../types";

vi.mock("@peculiar/certificates-viewer-react", () => ({
  PeculiarCertificateViewer: () => "x509 certificate viewer component",
  PeculiarCsrViewer: () => "CSR certificate viewer component",
}));

describe("<CertificateViewerDialog />", () => {
  const certificate = {
    raw: new ArrayBuffer(0),
    subjectName: "Certificate name",
    type: "x509",
    label: "Certificate name",
    subject: {
      commonName: "Certificate name",
    },
  } as unknown as CertificateProps;

  it("Should render as x509 and handle close", async () => {
    const onCloseMock = vi.fn();

    render(
      <CertificateViewerDialog
        certificate={certificate}
        onClose={onCloseMock}
      />
    );

    expect(screen.getByText(`“${certificate.label}” details`));
    expect(screen.getByText(/x509 certificate viewer component/));

    await userEvent.click(screen.getByRole("button", { name: /Cancel/ }));

    expect(onCloseMock).toBeCalledTimes(1);
  });

  it("Should render as CSR", () => {
    render(
      <CertificateViewerDialog
        certificate={
          { ...certificate, type: "csr" } as unknown as CertificateProps
        }
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText(/CSR certificate viewer component/));
  });
});
