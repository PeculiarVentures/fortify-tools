import { render, screen } from "@testing";
import { certificateKeyUsageExtensions } from "src/config/data";
import { KeyUsagesCheckboxGroup } from "./KeyUsagesCheckboxGroup";

describe("<KeyUsagesCheckboxGroup />", () => {
  it("Should render", async () => {
    const { container } = render(
      <KeyUsagesCheckboxGroup className="test_class" />
    );

    const keyUsageExtensions = Object.values(certificateKeyUsageExtensions);

    expect(container.children[0]).toHaveClass("test_class");

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(keyUsageExtensions.length);

    keyUsageExtensions.forEach((value, index) => {
      expect(checkboxes[index]).toHaveAttribute("name", "keyUsage");
      expect(checkboxes[index]).toHaveAttribute("value", value);
    });
  });
});
