import { render, vi, userEvent } from "@testing";
import { CertificatesProvidersListItem } from "./CertificatesProvidersListItem";

describe("<CertificatesProvidersListItem />", () => {
  const provider = {
    id: "1",
    name: "Provider 1",
    isRemovable: false,
    readOnly: false,
  };

  it("Should render & handle click", async () => {
    const handleClick = vi.fn((data) => data);

    const { getByText } = render(
      <CertificatesProvidersListItem
        provider={provider}
        isSelected={false}
        onClick={handleClick}
      />
    );

    const title = getByText(provider.name);

    expect(title).toBeInTheDocument();

    await userEvent.click(title);
    expect(handleClick).toBeCalledTimes(1);
    expect(handleClick).toHaveReturnedWith(provider.id);
  });

  it("Should render as selected", async () => {
    const { getByRole } = render(
      <CertificatesProvidersListItem
        provider={provider}
        isSelected={true}
        onClick={vi.fn()}
      />
    );

    expect(getByRole("listitem").getAttribute("class")).toMatch(
      /current_list_item/
    );
  });

  it("Should render as removable", async () => {
    const { getByTestId } = render(
      <CertificatesProvidersListItem
        provider={{ ...provider, isRemovable: true }}
        isSelected={false}
        onClick={vi.fn()}
      />
    );

    expect(getByTestId(/smardcart_icon/)).toBeInTheDocument();
  });

  it("Should render as readonly", async () => {
    const { getByText } = render(
      <CertificatesProvidersListItem
        provider={{ ...provider, readOnly: true }}
        isSelected={false}
        onClick={vi.fn()}
      />
    );

    expect(getByText(/Read only/)).toBeInTheDocument();
  });
});
