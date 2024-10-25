import { render, screen } from "@testing";
import { AppProviders } from "./AppProviders";

vi.mock("@peculiar/react-components", async () => {
  const actual = await vi.importActual("@peculiar/react-components");
  return {
    ...actual,
    ToastProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="toast_provider">{children}</div>
    ),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="theme_provider">{children}</div>
    ),
  };
});

describe("<AppProviders />", () => {
  it("Should render children", async () => {
    render(
      <AppProviders>
        <div>Child Element</div>
      </AppProviders>
    );
    expect(screen.getByText(/Child Element/)).toBeInTheDocument();
  });

  it("Should render fallback if an error is thrown", () => {
    const ErrorComponent = () => {
      throw new Error("Test Error");
    };

    render(
      <AppProviders>
        <ErrorComponent />
      </AppProviders>
    );

    expect(screen.getByText(/Oops! Something went wrong/)).toBeInTheDocument();
  });

  it("Should applies theme & toast providers", () => {
    render(
      <AppProviders>
        <div>Child Element</div>
      </AppProviders>
    );

    expect(screen.getByTestId("theme_provider")).toBeInTheDocument();
    expect(screen.getByTestId("toast_provider")).toBeInTheDocument();
  });
});
