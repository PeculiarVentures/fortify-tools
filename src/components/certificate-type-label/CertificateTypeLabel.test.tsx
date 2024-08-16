import { render } from "@testing";
import { CertificateTypeLabel } from "./CertificateTypeLabel";

describe("<CertificateTypeLabel />", () => {
  it("Should render as x509 type", () => {
    const { getByTestId, getByText } = render(
      <CertificateTypeLabel type="x509" />
    );

    expect(getByTestId("icon_type_x509")).toBeInTheDocument();
    expect(getByText(/Certificate/)).toBeInTheDocument();
  });

  it("Should render as unknown type", () => {
    const { getByText } = render(
      <CertificateTypeLabel type={"unknown_type" as "x509"} />
    );

    expect(getByText(/unknown_type/)).toBeInTheDocument();
  });

  it("Should render with className", () => {
    const { getByText } = render(
      <CertificateTypeLabel type="x509" className="test_class_name" />
    );

    expect(
      getByText(/Certificate/).parentElement?.getAttribute("class")
    ).toMatch(/test_class_name/);
  });
});
