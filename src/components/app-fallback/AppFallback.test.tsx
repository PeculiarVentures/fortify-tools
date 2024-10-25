import { render, screen, userEvent } from "@testing";
import { AppFallback } from "./AppFallback";

describe("<AppFallback />", () => {
  it("Should render and handle click", async () => {
    const resetErrorBoundaryMock = vi.fn();
    render(
      <AppFallback resetErrorBoundary={resetErrorBoundaryMock} error={""} />
    );

    expect(screen.getByText(/Oops! Something went wrong/)).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, an error has occurred. Please try again/)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Home page",
      })
    ).toHaveAttribute("href", "/");

    await userEvent.click(screen.getByRole("button", { name: /Try again/ }));

    expect(resetErrorBoundaryMock).toHaveBeenCalledTimes(1);
  });
});
