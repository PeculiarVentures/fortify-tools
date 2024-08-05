import { render } from "@testing";
import { KeyUsagesCheckboxGroup } from "./KeyUsagesCheckboxGroup";

describe("<KeyUsagesCheckboxGroup />", () => {
  it("Should render", async () => {
    const { container, getAllByRole } = render(
      <KeyUsagesCheckboxGroup className="test_class" />
    );

    expect(container.children[0]).toHaveClass("test_class");

    const checkboxes = getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(5);
  });
});
