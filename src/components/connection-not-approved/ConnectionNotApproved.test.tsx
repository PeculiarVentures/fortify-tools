import { render, userEvent } from "@testing";
import { ConnectionNotApproved } from "./ConnectionNotApproved";

describe("<ConnectionNotApproved />", () => {
  it("Should render", async () => {
    const reloadMock = vi.fn();
    vi.stubGlobal("location", {
      reload: reloadMock,
    });
    const { getByText, getByRole, container } = render(
      <ConnectionNotApproved />
    );

    expect(container.querySelector("svg")).toBeInTheDocument();

    expect(getByText(/You did not approve/)).toBeInTheDocument();
    expect(
      getByText(/If you want to try again click button below/)
    ).toBeInTheDocument();

    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/Try again/);

    await userEvent.click(button);

    expect(reloadMock).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
