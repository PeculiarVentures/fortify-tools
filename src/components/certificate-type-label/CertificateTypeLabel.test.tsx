import { render, screen } from "@testing";
import { CertificateTypeLabel } from "./CertificateTypeLabel";

vi.mock("../../icons/certificate-30.svg?react", () => ({
  default: () => <svg data-testid="certificate_icon" />,
}));

vi.mock("../../icons/certificate-with-key-30.svg?react", () => ({
  default: () => <svg data-testid="certificate_with_key_icon" />,
}));

describe("<CertificateTypeLabel />", () => {
  it("Should render as x509 type", () => {
    render(<CertificateTypeLabel type="x509" withPrivatKey={false} />);

    expect(screen.getByTestId("certificate_icon")).toBeInTheDocument();
    expect(screen.getByText(/Certificate/)).toBeInTheDocument();
  });

  it("Should render as x509 type with privat key", () => {
    render(<CertificateTypeLabel type="x509" withPrivatKey={true} />);

    expect(screen.getByTestId("certificate_with_key_icon")).toBeInTheDocument();
    expect(screen.getByText(/(with private key)/)).toBeInTheDocument();
  });

  it("Should render as unknown type", () => {
    render(
      <CertificateTypeLabel
        type={"unknown_type" as "x509"}
        withPrivatKey={false}
      />
    );

    expect(screen.getByText(/unknown_type/)).toBeInTheDocument();
  });

  it("Should render with className", () => {
    render(
      <CertificateTypeLabel
        type="x509"
        className="test_class_name"
        withPrivatKey={false}
      />
    );

    expect(screen.getByText(/Certificate/).closest("div")).toHaveClass(
      "test_class_name"
    );
  });
});
