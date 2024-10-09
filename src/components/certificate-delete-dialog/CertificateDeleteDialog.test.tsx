import { ComponentProps } from "react";
import { render, userEvent, screen } from "@testing";
import { CertificateDeleteDialog } from "./CertificateDeleteDialog";

describe("<CertificateDeleteDialog />", () => {
  const defaultProps: ComponentProps<typeof CertificateDeleteDialog> = {
    certificateName: "Certificate Name",
    certificateId: "1",
    onDialogClose: vi.fn(),
    onDeleteClick: vi.fn((data) => data),
  };

  it("Should render and handle buttons click", async () => {
    render(<CertificateDeleteDialog {...defaultProps} />);

    expect(
      screen.getByText(
        `Are you sure you want to delete “${defaultProps.certificateName}”?`
      )
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Cancel/ }));

    expect(defaultProps.onDialogClose).toBeCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: /Delete/ }));

    expect(defaultProps.onDeleteClick).toBeCalledTimes(1);
    expect(defaultProps.onDeleteClick).toBeCalledWith(
      defaultProps.certificateId
    );
  });

  it("Should render loading", () => {
    render(<CertificateDeleteDialog {...defaultProps} loading={true} />);

    expect(screen.getByText(/Deleting certificate/)).toBeInTheDocument();
  });
});
