import { render, screen } from "@testing";
import { CertificatesSidebar } from "./CertificatesSidebar";
import { APP_CONTACT_SUPPORT_URL } from "../../config";

describe("<CertificatesSidebar />", () => {
  it("Should render", () => {
    render(<CertificatesSidebar />);

    expect(screen.getByAltText("Fortify logo")).toHaveAttribute(
      "src",
      "/images/logo.svg"
    );

    expect(
      screen.getByText(/Fortify by Peculiar Ventures/)
    ).toBeInTheDocument();

    expect(screen.getByText(/Contact support/)).toHaveAttribute(
      "href",
      APP_CONTACT_SUPPORT_URL
    );
  });
});
