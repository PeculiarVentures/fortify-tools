import { ComponentProps } from "react";
import { render, userEvent } from "@testing";
import { CertificatesList } from "./CertificatesList";
import { CertificateProps } from "../../types";
import { downloadCertificate } from "../../utils/download-certificate";
import * as certificateUtils from "../../utils/certificate";

vi.mock("../../utils/download-certificate");

describe("<CertificatesList />", () => {
  const certificates = [
    {
      id: "1",
      index: "index1",
      providerID: "provider1",
      subject: {
        commonName: "Test 1",
      },
      subjectName: "Test 1",
      raw: new ArrayBuffer(1),
      type: "x509",
    },
    {
      id: "2",
      index: "index2",
      providerID: "provider2",
      subject: {
        commonName: "Test 2",
      },
      subjectName: "Test 2",
      raw: new ArrayBuffer(0),
    },
  ] as unknown as CertificateProps[];
  const defaultProps: ComponentProps<typeof CertificatesList> = {
    certificates: [],
    currentSortDir: "asc",
    currentSortName: "label",
    onDelete: vi.fn(),
    onSort: vi.fn(),
    onViewDetails: vi.fn(),
  };

  it("Should render loading state", () => {
    const { getAllByRole } = render(
      <CertificatesList {...defaultProps} loading={true} />
    );

    expect(getAllByRole("row")).toHaveLength(13);
  });

  it("Should render empty search state", () => {
    const { getByText } = render(
      <CertificatesList {...defaultProps} highlightedText="test" />
    );

    expect(getByText(/There are no results for/)).toBeInTheDocument();
    expect(getByText(/test/)).toBeInTheDocument();
  });

  it("Should render empty state", () => {
    const { getByText } = render(<CertificatesList {...defaultProps} />);

    expect(getByText(/There are no certificates yet/)).toBeInTheDocument();
  });

  it("Should render certificates", () => {
    const { getByText, getAllByRole } = render(
      <CertificatesList {...defaultProps} certificates={certificates} />
    );

    expect(getAllByRole("columnheader")).toHaveLength(4);

    expect(getByText(/Type/)).toBeInTheDocument();
    expect(getByText(/Name/)).toBeInTheDocument();
    expect(getByText(/Serial number/)).toBeInTheDocument();
    expect(getByText(/Expires/)).toBeInTheDocument();

    expect(getAllByRole("row")).toHaveLength(3);
    expect(getAllByRole("cell")).toHaveLength(8);
  });

  it("Should render & handle delete", async () => {
    const handleDelete = vi.fn((data) => data);
    const { getByLabelText } = render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        onDelete={handleDelete}
      />
    );

    const buttonDelete = getByLabelText(/Delete certificate/);
    expect(buttonDelete).toBeInTheDocument();

    await userEvent.click(buttonDelete);

    expect(handleDelete).toBeCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith({
      certificateIndex: certificates[0].index,
      label: certificates[0].subjectName,
      providerId: certificates[0].providerID,
    });
  });

  it("Should render & handle view details", async () => {
    const handleViewDetails = vi.fn((data) => data);
    const { getByText } = render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        onViewDetails={handleViewDetails}
      />
    );

    const buttonViewDetails = getByText(/View details/).closest(
      "button"
    ) as HTMLButtonElement;

    expect(buttonViewDetails).toBeInTheDocument();

    await userEvent.click(buttonViewDetails);

    expect(handleViewDetails).toBeCalledTimes(1);
    expect(handleViewDetails).toHaveBeenCalledWith(certificates[0]);
  });

  it("Should render & handle download", async () => {
    const { getByLabelText } = render(
      <CertificatesList {...defaultProps} certificates={[certificates[0]]} />
    );

    const buttonDownload = getByLabelText(/Download certificate/);
    expect(buttonDownload).toBeInTheDocument();

    await userEvent.click(buttonDownload);

    expect(downloadCertificate).toBeCalledTimes(1);
    expect(downloadCertificate).toHaveBeenCalledWith(
      certificates[0].subjectName,
      certificates[0].raw,
      certificates[0].type
    );
  });

  it("Should render & handle copy", async () => {
    vi.spyOn(certificateUtils, "certificateRawToPem").mockImplementation(
      vi.fn()
    );

    const { getByLabelText } = render(
      <CertificatesList {...defaultProps} certificates={[certificates[0]]} />
    );

    const buttonCopy = getByLabelText(/Copy certificate/);
    expect(buttonCopy).toBeInTheDocument();

    await userEvent.click(buttonCopy);

    expect(certificateUtils.certificateRawToPem).toBeCalledTimes(1);
    expect(certificateUtils.certificateRawToPem).toHaveBeenCalledWith(
      certificates[0].raw,
      certificates[0].type
    );
  });
});
