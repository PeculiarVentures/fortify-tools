import { render, screen } from "@testing";
import { ConnectionNotSupported } from "./ConnectionNotSupported";

describe("<ConnectionNotSupported />", () => {
  it("Should render", async () => {
    render(<ConnectionNotSupported />);

    expect(
      screen.getByText(
        /Unfortunately Fortify isn’t available for mobile devices yet/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Please try again from a Windows, macOS, or Linux computer/
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Home page",
      })
    ).toHaveAttribute("href", "https://fortifyapp.com");

    expect(
      screen.getByRole("link", {
        name: "Get started",
      })
    ).toHaveAttribute("href", "https://fortifyapp.com/docs#support");
  });
});
