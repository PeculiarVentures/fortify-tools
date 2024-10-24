import { render, userEvent, screen } from "@testing";
import { CertificatesProvidersList } from "./CertificatesProvidersList";

vi.mock("@peculiar/react-components", async () => {
  const actual = await vi.importActual("@peculiar/react-components");
  return {
    ...actual,
    Skeleton: ({ height }: { height: number }) => (
      <div style={{ height }} role="presentation" />
    ),
  };
});

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

  it("Should render & handle onSelect", async () => {
    const onSelectMock = vi.fn((data) => data);

    render(
      <CertificatesProvidersList
        providers={providers}
        onSelect={onSelectMock}
        currentProviderId={providers[1].id}
      />
    );

    expect(screen.getByText(/Provider/)).toBeInTheDocument();

    const items = screen.getAllByRole("listitem");

    expect(items).toHaveLength(providers.length);

    items.forEach((value, index) => {
      expect(value).toHaveTextContent(providers[index].name);
    });

    expect(items[1].getAttribute("class")).toMatch(/current_list_item/);

    await userEvent.click(items[0]);
    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toHaveReturnedWith(providers[0].id);
  });

  it("shows render as loading", () => {
    render(<CertificatesProvidersList providers={[]} loading={true} />);
    expect(screen.getAllByRole("presentation")).toHaveLength(4);
  });

  it("shows render as empty", () => {
    render(<CertificatesProvidersList providers={[]} />);
    expect(screen.getByText(/No providers connected/)).toBeInTheDocument();
  });
});
