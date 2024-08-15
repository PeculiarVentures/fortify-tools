import { ComponentProps } from "react";
import { render } from "@testing";
import { FetchingStatusOwerlay } from "./FetchingStatusOwerlay";

describe("<FetchingStatusOwerlay />", () => {
  const defaultProps: ComponentProps<typeof FetchingStatusOwerlay> = {
    challenge: null,
    fetching: {},
  };

  it("Should render as error", () => {
    const { getByText } = render(<FetchingStatusOwerlay {...defaultProps} />);

    expect(getByText(/Oops! Something went wrong/)).toBeInTheDocument();
    expect(getByText(/Sorry, please try again later/)).toBeInTheDocument();
  });

  it("Should render as connectionClientUpdate rejected", () => {
    const { getByText } = render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionClientUpdate: "rejected",
        }}
      />
    );

    expect(
      getByText(/Update your local Fortify application/)
    ).toBeInTheDocument();
  });

  it("Should render as connectionSupport rejected", () => {
    const { getByText } = render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionSupport: "rejected",
        }}
      />
    );

    expect(getByText(/Connection not supported/)).toBeInTheDocument();
  });

  it("Should render as connectionDetect rejected", () => {
    const { getByText } = render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionDetect: "rejected",
        }}
      />
    );

    expect(
      getByText(/Launch your local Fortify application/)
    ).toBeInTheDocument();
  });

  it("Should render as connectionApprove rejected", () => {
    const { getByText } = render(
      <FetchingStatusOwerlay
        {...defaultProps}
        fetching={{
          connectionApprove: "rejected",
        }}
      />
    );

    expect(getByText(/You did not approve/)).toBeInTheDocument();
  });

  it("Should render as connectionApprove pending", () => {
    const { getByText } = render(
      <FetchingStatusOwerlay
        challenge="12345"
        fetching={{
          connectionApprove: "pending",
        }}
      />
    );

    expect(getByText(/Fortify authorization/)).toBeInTheDocument();
  });
});
