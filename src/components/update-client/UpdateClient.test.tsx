import { render } from "@testing";
import { UpdateClient } from "./UpdateClient";

describe("<UpdateClient />", () => {
  it("Should render", () => {
    const { getByText, container } = render(<UpdateClient />);

    expect(container.querySelector("svg")).toBeInTheDocument();

    expect(
      getByText(/Update your local Fortify application/)
    ).toBeInTheDocument();
    expect(
      getByText(
        /Your current version is outdated. Please go to your local Fortify application settings and check for updates/
      )
    ).toBeInTheDocument();
  });
});
