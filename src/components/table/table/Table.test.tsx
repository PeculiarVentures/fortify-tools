import { render } from "@testing";
import { Table } from "./Table";

describe("<Table />", () => {
  it("should render", () => {
    const { getByTestId } = render(<Table data-testid="table" />);
    const tableElement = getByTestId("table");

    expect(tableElement).toBeInTheDocument();
  });
});
