import { render, userEvent, vi, screen } from "@testing";
import { CertificatesTopbar } from "./CertificatesTopbar";

describe("<CertificatesTopbar />", () => {
  const defaultProps = {
    isLoggedIn: true,
    isDisabled: false,
    isReadOnly: false,
    onReload: vi.fn(),
    onLoginLogout: vi.fn(),
    onCreate: vi.fn(),
    onImport: vi.fn(),
    onSearch: vi.fn(),
    onInfo: vi.fn(),
  };

  it("Should render as disabled", async () => {
    render(
      <CertificatesTopbar
        {...defaultProps}
        isDisabled={true}
        isLoggedIn={false}
      />
    );

    expect(screen.getByRole("searchbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: /Refresh list/ })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Provider information/ })
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: /Sign in/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /New/ })).toBeDisabled();
  });

  it("Should render as not logged in", async () => {
    render(<CertificatesTopbar {...defaultProps} isLoggedIn={false} />);

    expect(screen.getByRole("button", { name: /Sign in/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /New/ })).toBeDisabled();
  });

  it("Should render as logged in", async () => {
    render(<CertificatesTopbar {...defaultProps} isLoggedIn={true} />);

    expect(
      screen.getByRole("button", { name: /Sign out/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /New/ })).toBeEnabled();
  });

  it("Should render as read only", async () => {
    render(<CertificatesTopbar {...defaultProps} isReadOnly={true} />);

    expect(
      screen.queryByRole("button", { name: /New/ })
    ).not.toBeInTheDocument();
  });

  it("Should handle onReload", async () => {
    const onReloadMock = vi.fn();
    render(<CertificatesTopbar {...defaultProps} onReload={onReloadMock} />);

    await userEvent.click(screen.getByRole("button", { name: /Refresh list/ }));

    expect(onReloadMock).toBeCalledTimes(1);
  });

  it("Should handle onInfo", async () => {
    const onInfoMock = vi.fn();
    render(<CertificatesTopbar {...defaultProps} onInfo={onInfoMock} />);

    await userEvent.click(
      screen.getByRole("button", { name: /Provider information/ })
    );

    expect(onInfoMock).toBeCalledTimes(1);
  });

  it("Should handle onLoginLogout", async () => {
    const onLoginLogoutMock = vi.fn((data) => data);
    render(
      <CertificatesTopbar {...defaultProps} onLoginLogout={onLoginLogoutMock} />
    );

    await userEvent.click(screen.getByRole("button", { name: /Sign out/ }));

    expect(onLoginLogoutMock).toBeCalledTimes(1);
    expect(onLoginLogoutMock).toHaveReturnedWith(true);
  });

  it("Should handle create CSR", async () => {
    const onCreateMock = vi.fn((data) => data);
    render(<CertificatesTopbar {...defaultProps} onCreate={onCreateMock} />);

    const newButton = screen.getByRole("button", { name: "New" });

    await userEvent.click(newButton);

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: /Create certificate signing request \(CSR\)/,
      })
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    expect(onCreateMock).toBeCalledTimes(1);
    expect(onCreateMock).toHaveReturnedWith("csr");
  });

  it("Should handle create x509", async () => {
    const onCreateMock = vi.fn((data) => data);
    render(<CertificatesTopbar {...defaultProps} onCreate={onCreateMock} />);

    const newButton = screen.getByRole("button", { name: "New" });

    await userEvent.click(newButton);

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: /Create self-signed certificate/,
      })
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    expect(onCreateMock).toBeCalledTimes(1);
    expect(onCreateMock).toHaveReturnedWith("x509");
  });

  it("Should handle import", async () => {
    const onImportMock = vi.fn();
    render(<CertificatesTopbar {...defaultProps} onImport={onImportMock} />);

    const newButton = screen.getByRole("button", { name: "New" });

    await userEvent.click(newButton);

    expect(screen.getByRole("presentation")).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("menuitem", {
        name: /Import certificate/,
      })
    );

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    expect(onImportMock).toBeCalledTimes(1);
  });

  it("Should handle search", async () => {
    const onSearchMock = vi.fn((data) => data);

    render(
      <CertificatesTopbar
        {...defaultProps}
        onSearch={onSearchMock}
        searchValue="test"
      />
    );

    await userEvent.type(screen.getByRole("searchbox"), "a");

    expect(onSearchMock).toBeCalledTimes(1);
    expect(onSearchMock).toHaveReturnedWith("testa");
  });

  it("Should handle search clear", async () => {
    const onSearchMock = vi.fn((data) => data);

    render(
      <CertificatesTopbar
        {...defaultProps}
        onSearch={onSearchMock}
        searchValue="test"
      />
    );

    await userEvent.click(screen.getByTestId("clear-search-button"));

    expect(onSearchMock).toBeCalledTimes(1);
    expect(onSearchMock).toHaveReturnedWith("");
  });
});
