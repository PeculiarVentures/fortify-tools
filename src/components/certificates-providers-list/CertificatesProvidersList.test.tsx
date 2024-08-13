import { render, vi, userEvent } from "@testing";
import { CertificatesProvidersList } from "./CertificatesProvidersList";

describe("<CertificatesProvidersList />", () => {
  const providers = [
    {
      id: "1",
      name: "Item 1",
      isRemovable: false,
      readOnly: false,
    },
    {
      id: "2",
      name: "Item 2",
      isRemovable: false,
      readOnly: false,
    },
  ];

  it("Should render & handle select", async () => {
    const handleSelect = vi.fn((data) => data);

    const { getByText, getAllByRole } = render(
      <CertificatesProvidersList
        providers={providers}
        onSelect={handleSelect}
        currentProviderId={providers[1].id}
      />
    );

    expect(getByText(/Provider/)).toBeInTheDocument();

    const items = getAllByRole("listitem");

    expect(items).toHaveLength(providers.length);

    items.forEach((value, index) => {
      expect(value).toHaveTextContent(providers[index].name);
    });

    expect(items[1].getAttribute("class")).toMatch(/current_list_item/);

    await userEvent.click(items[0]);
    expect(handleSelect).toBeCalledTimes(1);
    expect(handleSelect).toHaveReturnedWith(providers[0].id);
  });
});
