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
        /It seems Fortify application is turned off on your desktop. Please launch it to continue/
      )
    ).toBeInTheDocument();

    const buttonLink = getByRole("link");
    expect(buttonLink).toBeInTheDocument();
    expect(buttonLink).toHaveTextContent(/I don’t have one/);
    expect(buttonLink).toHaveAttribute("href", APP_FORTIFY_DOWLOAD_APP_URL);
  });
});
