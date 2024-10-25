import { render, screen } from "@testing";
import { CertificateSerialNumber } from "./CertificateSerialNumber";

describe("<CertificateSerialNumber />", () => {
  it("Should render", () => {
    render(<CertificateSerialNumber value="1234" />);

    expect(screen.getByText(/1234/)).toBeInTheDocument();
  });

  it("Should render as truncated", () => {
    render(<CertificateSerialNumber value="1234567890ABCDEF" />);

    expect(screen.getByText(/12345 ... CDEF/)).toBeInTheDocument();
  });

  it("Should render with className", () => {
    render(
      <CertificateSerialNumber value="1234" className="test_class_name" />
    );

    expect(screen.getByText(/1234/)).toHaveClass("test_class_name");
  });
});
