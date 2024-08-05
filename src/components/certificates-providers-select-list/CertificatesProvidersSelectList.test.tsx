import { describe, it, render, vi, expect, userEvent } from "@testing";
import { CertificatesProvidersSelectList } from "./CertificatesProvidersSelectList";

describe("<CertificatesProvidersSelectList />", () => {
  it("Should render & handel select", async () => {
    const handleSelect = vi.fn((data) => data);

    const providers = [
      {
        id: "1",
        name: "Provider 1",
      },
      {
        id: "2",
        name: "Provider 2",
      },
    ];

    const { getByRole, getAllByRole, queryByRole } = render(
      <CertificatesProvidersSelectList
        providers={providers}
        onSelect={handleSelect}
        className="test_combobox"
        popoverClassName="test_combobox_popup"
        currentProviderId={providers[0].id}
      />
    );

    const combobox = getByRole("combobox");
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveTextContent(providers[0].name);
    expect(combobox.parentElement).toHaveClass("test_combobox");

    await userEvent.click(combobox);

    const comboboxPopup = getByRole("presentation");
    expect(comboboxPopup).toBeInTheDocument();

    expect(
      comboboxPopup.querySelector(".test_combobox_popup")
    ).toBeInTheDocument();

    const comboboxItems = getAllByRole("option");
    expect(comboboxItems).toHaveLength(2);

    await userEvent.click(comboboxItems[1]);

    expect(queryByRole("presentation")).not.toBeInTheDocument();

    expect(handleSelect).toBeCalledTimes(1);
    expect(handleSelect).toHaveReturnedWith(providers[1].id);
  });
});
