import { ComponentProps } from "react";
import { render, screen } from "@testing";
import { FetchingStatusOwerlay } from "./FetchingStatusOwerlay";

describe("<FetchingStatusOwerlay />", () => {
  const defaultProps: ComponentProps<typeof FetchingStatusOwerlay> = {
    challenge: null,
    fetching: {},
    onReload: vi.fn(),
  };

  it("Should render as error", () => {
    render(<FetchingStatusOwerlay {...defaultProps} />);

    expect(screen.getByText(/Oops! Something went wrong/)).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, please try again later/)
    ).toBeInTheDocument();
  });

  it("Should render as connectionClientUpdate rejected", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionClientUpdate: "rejected",
        }}
      />
    );

    expect(
      screen.getByText(/Update your local Fortify application/)
    ).toBeInTheDocument();
  });

  it("Should render as connectionSupport rejected", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionSupport: "rejected",
        }}
      />
    );

    expect(screen.getByText(/Connection not supported/)).toBeInTheDocument();
  });

  it("Should render as connectionDetect rejected", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionDetect: "rejected",
        }}
      />
    );

    expect(
      screen.getByText(/Launch your local Fortify application/)
    ).toBeInTheDocument();
  });

  it("Should render as connectionApprove rejected", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionApprove: "rejected",
        }}
      />
    );

    expect(screen.getByText(/You did not approve/)).toBeInTheDocument();
  });

  it("Should render as connectionApprove pending", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        challenge="12345"
        fetching={{
          connectionApprove: "pending",
        }}
      />
    );

    expect(screen.getByText(/Fortify authorization/)).toBeInTheDocument();
  });

  it("Shouldn't render if certificates fetching state is present", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          certificates: "resolved",
        }}
      />
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Shouldn't render if connectionDetect is pending", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionDetect: "pending",
        }}
      />
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Shouldn't render if connectionSupport is pending", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionSupport: "pending",
        }}
      />
    );
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Shouldn't render if connectionApprove is pending", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionApprove: "pending",
        }}
      />
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Shouldn't render if providers fetching state is pending", () => {
    render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          providers: "pending",
        }}
      />
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });
});
