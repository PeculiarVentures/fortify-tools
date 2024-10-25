import { render, screen } from "@testing";
import { Date } from "./Date";

describe("<Date />", () => {
  const testDate = new global.Date("2024-01-01");

  it("Should render", () => {
    render(<Date date={testDate} />);

    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
  });

  it("Should render with className", () => {
    render(<Date date={testDate} className="test_class_name" />);

    expect(screen.getByText(/Jan 1, 2024/)).toHaveClass("test_class_name");
  });
});
