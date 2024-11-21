import { render, screen, userEvent } from "@testing";
import { CopyIconButton } from "./CopyIconButton";

describe("<CopyIconButton />", () => {
  const copyValue = "1234";
  beforeAll(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        readText: vi.fn(() => Promise.resolve(copyValue)),
        writeText: vi.fn(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  it("Should render & click", async () => {
    render(<CopyIconButton value={copyValue} />);

    await userEvent.click(screen.getByRole("button"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(copyValue);
  });

  it("Should support function values for copy", async () => {
    const valueFunction = () => copyValue;
    render(<CopyIconButton value={valueFunction} />);

    await userEvent.click(screen.getByRole("button"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(copyValue);
  });
});
