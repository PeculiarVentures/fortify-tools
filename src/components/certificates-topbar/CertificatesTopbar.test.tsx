import { render, userEvent, vi } from "@testing";
import { CertificatesTopbar } from "./CertificatesTopbar";

describe("<CertificatesTopbar />", () => {
  it("Should render & handle create", async () => {
    const handleCreate = vi.fn((data) => data);
    const { getAllByRole, getByRole, queryByRole } = render(
      <CertificatesTopbar
        onCreate={handleCreate}
        onImport={vi.fn()}
        onSearch={vi.fn()}
      />
    );

    const buttons = getAllByRole("button");

    const createButton = buttons[2];
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveTextContent(/Create/);

    await userEvent.click(createButton);

    const popup1 = getByRole("presentation");
    expect(popup1).toBeInTheDocument();

    const items1 = getAllByRole("menuitem");
    expect(items1).toHaveLength(2);

    await userEvent.click(items1[0]);

    expect(handleCreate).toBeCalledTimes(1);
    expect(handleCreate).toHaveReturnedWith("csr");

    expect(queryByRole("presentation")).not.toBeInTheDocument();

    await userEvent.click(createButton);

    const popup2 = getByRole("presentation");
    expect(popup2).toBeInTheDocument();

    const items2 = getAllByRole("menuitem");
    expect(items2).toHaveLength(2);

    await userEvent.click(items2[1]);

    expect(handleCreate).toBeCalledTimes(2);
    expect(handleCreate).toHaveReturnedWith("x509");

    expect(queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Should render & handle import", async () => {
    const handleImport = vi.fn();
    const { getAllByRole } = render(
      <CertificatesTopbar
        onCreate={vi.fn()}
        onImport={handleImport}
        onSearch={vi.fn()}
      />
    );

    const buttons = getAllByRole("button");

    const importButton = buttons[1];
    expect(importButton).toBeInTheDocument();
    expect(importButton).toHaveTextContent(/Import certificate/);

    await userEvent.click(importButton);

    expect(handleImport).toBeCalledTimes(1);
  });

  it("Should render & handle search", async () => {
    const handleSearch = vi.fn((data) => data);

    const { getByRole } = render(
      <CertificatesTopbar
        onCreate={vi.fn()}
        onImport={vi.fn()}
        onSearch={handleSearch}
        searchValue="test"
      />
    );

    const searchbox = getByRole("searchbox");
    expect(searchbox).toBeInTheDocument();

    await userEvent.type(searchbox, "a");

    expect(handleSearch).toBeCalledTimes(1);
    expect(handleSearch).toHaveReturnedWith("testa");
  });

  it("Should render & handle search clear", async () => {
    const handleSearch = vi.fn((data) => data);

    const { getByRole, getAllByRole } = render(
      <CertificatesTopbar
        onCreate={vi.fn()}
        onImport={vi.fn()}
        onSearch={handleSearch}
        searchValue="test"
      />
    );

    const searchbox = getByRole("searchbox");
    expect(searchbox).toBeInTheDocument();

    const clearButton = getAllByRole("button")[0];
    expect(clearButton).toBeInTheDocument();

    await userEvent.click(clearButton);

    expect(handleSearch).toBeCalledTimes(1);
    expect(handleSearch).toHaveReturnedWith("");
  });
});
