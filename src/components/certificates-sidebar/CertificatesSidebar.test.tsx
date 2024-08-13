import { render } from "@testing";
import { CertificatesSidebar } from "./CertificatesSidebar";
import { APP_CONTACT_SUPPORT_URL } from "../../config";

describe("<CertificatesSidebar />", () => {
  it("Should render", async () => {
    const { getByText, getByRole } = render(<CertificatesSidebar />);

    const logo = getByRole("img");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("alt", "Fortify logo");

    expect(getByText(/Fortify by Peculiar Ventures/)).toBeInTheDocument();

    const contactLink = getByText(/Contact support/);
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute("href", APP_CONTACT_SUPPORT_URL);
  });
});
