import { render, userEvent, fireEvent, screen } from "@testing";
import { CertificatesProvidersListItem } from "./CertificatesProvidersListItem";

vi.mock("../../icons/smartcard.svg?react", () => ({
  default: () => <svg data-testid="smartcard_icon" />,
}));

describe("<CertificatesProvidersListItem />", () => {
  const provider = {
    id: "1",
    name: "Provider 1",
    isRemovable: false,
    readOnly: false,
  };

  const defaultProps = {
    provider,
    isSelected: false,
    onClick: vi.fn(),
  };

  it("Should render & handle click", async () => {
    const onClickMock = vi.fn((data) => data);
    render(
      <CertificatesProvidersListItem {...defaultProps} onClick={onClickMock} />
    );

    await userEvent.click(screen.getByText(provider.name));
    expect(onClickMock).toBeCalledTimes(1);
    expect(onClickMock).toHaveReturnedWith(provider.id);
  });

  it("Should render & handle onClick when Enter is pressed", async () => {
    const onClickMock = vi.fn((data) => data);
    render(
      <CertificatesProvidersListItem {...defaultProps} onClick={onClickMock} />
    );

    fireEvent.keyDown(screen.getByText(provider.name), { code: "Enter" });
    expect(onClickMock).toBeCalledTimes(1);
    expect(onClickMock).toHaveReturnedWith(provider.id);
  });

  it("Should render as selected", async () => {
    render(
      <CertificatesProvidersListItem {...defaultProps} isSelected={true} />
    );

    expect(screen.getByRole("listitem").getAttribute("class")).toMatch(
      /current_list_item/
    );
  });

  it("Should render as removable", async () => {
    render(
      <CertificatesProvidersListItem
        {...defaultProps}
        provider={{ ...provider, isRemovable: true }}
      />
    );

    expect(screen.getByTestId(/smartcard_icon/)).toBeInTheDocument();
  });

  it("Should render as readonly", async () => {
    render(
      <CertificatesProvidersListItem
        {...defaultProps}
        provider={{ ...provider, readOnly: true }}
      />
    );

    expect(screen.getByText(/Read only/)).toBeInTheDocument();
  });
});
