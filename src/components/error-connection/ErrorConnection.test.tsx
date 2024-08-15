import { render } from "@testing";
import { ErrorConnection } from "./ErrorConnection";

describe("<ErrorConnection />", () => {
  it("Should render", () => {
    const { getByText, container } = render(
      <ErrorConnection message="Message" description="Description" />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();

    expect(getByText(/Message/)).toBeInTheDocument();
    expect(getByText(/Description/)).toBeInTheDocument();
  });
});
