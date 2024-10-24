import { render, userEvent, screen } from "@testing";
import { ConnectionNotDetected } from "./ConnectionNotDetected";
import { APP_FORTIFY_DOWLOAD_APP_URL } from "../../config";

vi.mock("../../icons/launch-app.svg?react", () => ({
  default: () => <svg data-testid="launch_app_icon" />,
}));

describe("<ConnectionNotDetected />", () => {
  it("Should render", async () => {
    const onReloadMock = vi.fn();
    render(<ConnectionNotDetected onReload={onReloadMock} />);

    expect(screen.getByTestId("launch_app_icon")).toBeInTheDocument();

    expect(
      screen.getByText(/Launch your local Fortify application/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /t seems Fortify application is turned off on your desktop. Please launch it to continue/
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/I don’t have one/).parentElement).toHaveAttribute(
      "href",
      APP_FORTIFY_DOWLOAD_APP_URL
    );

    await userEvent.click(screen.getByRole("button", { name: /Try again/ }));
    expect(onReloadMock).toHaveBeenCalledTimes(1);
  });
});
