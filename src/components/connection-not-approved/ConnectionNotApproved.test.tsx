import { render, userEvent, screen } from "@testing";
import { ConnectionNotApproved } from "./ConnectionNotApproved";

vi.mock("../../icons/fortify.svg?react", () => ({
  default: () => <svg data-testid="fortify_icon" />,
}));

describe("<ConnectionNotApproved />", () => {
  it("Should render", async () => {
    const onReloadMock = vi.fn();
    render(<ConnectionNotApproved onReload={onReloadMock} />);

    expect(screen.getByTestId("fortify_icon")).toBeInTheDocument();

    expect(screen.getByText(/You did not approve/)).toBeInTheDocument();
    expect(
      screen.getByText(/If you want to try again click button below/)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Try again/ }));

    expect(onReloadMock).toHaveBeenCalledTimes(1);
  });
});
