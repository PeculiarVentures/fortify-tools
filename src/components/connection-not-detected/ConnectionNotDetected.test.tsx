import { render } from "@testing";
import { ConnectionNotDetected } from "./ConnectionNotDetected";
import { APP_FORTIFY_DOWLOAD_APP_URL } from "../../config";

describe("<ConnectionNotDetected />", () => {
  it("Should render", () => {
    const { getByText, getByRole, container } = render(
      <ConnectionNotDetected />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();

    expect(
      getByText(/Launch your local Fortify application/)
    ).toBeInTheDocument();
    expect(
      getByText(
        /t seems Fortify application is turned off on your desktop. Please launch it to continue/
      )
    ).toBeInTheDocument();

    const contactLink = getByRole("link");
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveTextContent(/I don’t have one/);
    expect(contactLink).toHaveAttribute("href", APP_FORTIFY_DOWLOAD_APP_URL);
  });
});
