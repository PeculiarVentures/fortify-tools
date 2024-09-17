import { render, screen } from "@testing";
import { Table } from "./Table";

describe("<Table />", () => {
  it("should render", () => {
    render(<Table data-testid="table" />);
    const tableElement = screen.getByTestId("table");

    expect(tableElement).toBeInTheDocument();
  });
});
