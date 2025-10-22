import { ComponentProps } from 'react';
import {
  render, userEvent, fireEvent, screen,
} from '@testing';
import { ICertificateProps } from '../../types';
import { downloadCertificate } from '../../utils/download-certificate';
import * as certificateUtils from '../../utils/certificate';
import { CertificatesList } from './CertificatesList';

vi.mock('../../utils/download-certificate');

vi.mock('@peculiar/react-components', async () => {
  const actual = await vi.importActual('@peculiar/react-components');

  return {
    ...actual,
    Skeleton: ({ height }: { height: number }) => (
      <div style={{ height }} role="presentation" />
    ),
  };
});

describe('<CertificatesList />', () => {
  const certificates = [
    {
      id: '1',
      providerID: 'provider1',
      subject: { CN: ['Test 1'] },
      subjectName: 'Test 1',
      raw: new ArrayBuffer(1),
      type: 'x509',
      serialNumber: '1',
      notAfter: new Date('2024-01-01'),
    },
    {
      id: '2',
      providerID: 'provider1',
      subject: { CN: ['Test 2'] },
      subjectName: 'Test 2',
      raw: new ArrayBuffer(0),
      type: 'x509',
      serialNumber: '2',
      notAfter: new Date('2024-01-02'),
    },
  ] as unknown as ICertificateProps[];
  const defaultProps: ComponentProps<typeof CertificatesList> = {
    certificates: [],
    currentSortDir: 'asc',
    currentSortName: 'label',
    onDelete: vi.fn(),
    onSort: vi.fn(),
    onViewDetails: vi.fn(),
    isLoggedIn: true,
    isReadOnly: false,
  };

  it('Should render loading state', () => {
    render(
      <CertificatesList {...defaultProps} loading={true} />,
    );

    expect(screen.getAllByRole('row')).toHaveLength(13);
    expect(screen.getAllByRole('presentation')).toHaveLength(48);

    screen.getAllByRole('columnheader').forEach((elem) => {
      expect(elem.children[0]).toBeDisabled();
    });
  });

  it('Should render empty search state', () => {
    render(
      <CertificatesList {...defaultProps} highlightedText="test-search" />,
    );

    expect(screen.getByText(/There are no results for/)).toBeInTheDocument();
    expect(screen.getByText(/test-search/)).toBeInTheDocument();
  });

  it('Should render empty state', () => {
    render(
      <CertificatesList {...defaultProps} />,
    );

    expect(
      screen.getByText(/There are no certificates yet/),
    ).toBeInTheDocument();
  });

  it('Should render certificates list', () => {
    render(
      <CertificatesList {...defaultProps} certificates={certificates} />,
    );

    const columnsLabels = [/Type/, /Name/, /Serial number/, /Expires/];

    screen
      .getAllByRole('columnheader')
      .forEach((elem, index) =>
        expect(elem).toHaveTextContent(columnsLabels[index]),
      );

    expect(screen.getAllByRole('row')).toHaveLength(3);

    const cells = screen.getAllByRole('cell');

    expect(cells).toHaveLength(8);

    expect(cells[1]).toHaveTextContent(/Test 1/);
    expect(cells[2]).toHaveTextContent(/1/);
    expect(cells[3]).toHaveTextContent(/Jan 1, 2024/);

    expect(cells[5]).toHaveTextContent(/Test 2/);
    expect(cells[6]).toHaveTextContent(/2/);
    expect(cells[7]).toHaveTextContent(/Jan 2, 2024/);
  });

  it('Should render certificates list with readOnly provider', () => {
    render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        isReadOnly
      />,
    );

    expect(
      screen.queryByLabelText(/Delete certificate/),
    ).not.toBeInTheDocument();
  });

  it('Should render certificates list with not loggedIn to provider', () => {
    render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        isLoggedIn={false}
      />,
    );

    expect(screen.getByLabelText(/Delete certificate/)).toBeDisabled();
  });

  it('Should handle onSort when sort buttons are clicked', async () => {
    const onSortMock = vi.fn((data) => data);

    render(
      <CertificatesList
        {...defaultProps}
        certificates={certificates}
        currentSortDir="asc"
        currentSortName="type"
        onSort={onSortMock}
      />,
    );

    await userEvent.click(screen.getByText(/Type/));

    expect(onSortMock).toBeCalledTimes(1);
    expect(onSortMock).toHaveBeenCalledWith('type', 'desc');

    await userEvent.click(screen.getByText(/Name/));

    expect(onSortMock).toBeCalledTimes(2);
    expect(onSortMock).toHaveBeenCalledWith('label', 'asc');
  });

  it('Should handle onDelete when Delete button is clicked', async () => {
    const onDeleteMock = vi.fn((data) => data);

    render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        onDelete={onDeleteMock}
      />,
    );

    await userEvent.click(screen.getByLabelText(/Delete certificate/));

    expect(onDeleteMock).toBeCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith({
      certificateIndex: certificates[0].index,
      label: certificates[0].subjectName,
      providerId: certificates[0].providerID,
    });
  });

  it('Should handle onViewDetails when row is clicked', async () => {
    const onViewDetailsMock = vi.fn((data) => data);

    render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        onViewDetails={onViewDetailsMock}
      />,
    );

    await userEvent.click(screen.getByText(/Test 1/));

    expect(onViewDetailsMock).toBeCalledTimes(1);
    expect(onViewDetailsMock).toHaveBeenCalledWith({
      providerId: certificates[0].providerID,
      certificate: certificates[0],
    });
  });

  it('Should handle onViewDetails when Enter or Space is pressed on a row', () => {
    const onViewDetailsMock = vi.fn();
    const resultMock = {
      providerId: certificates[0].providerID,
      certificate: certificates[0],
    };

    render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        onViewDetails={onViewDetailsMock}
      />,
    );

    const row = screen.getByText(/Test 1/);

    row.focus();

    fireEvent.keyDown(row, { code: 'Enter' });
    expect(onViewDetailsMock).toHaveBeenCalledWith(resultMock);

    onViewDetailsMock.mockClear();

    fireEvent.keyDown(row, { code: 'Space' });
    expect(onViewDetailsMock).toHaveBeenCalledWith(resultMock);
  });

  it('Should handle onViewDetails when View details button is clicked', async () => {
    const onViewDetailsMock = vi.fn((data) => data);

    render(
      <CertificatesList
        {...defaultProps}
        certificates={[certificates[0]]}
        onViewDetails={onViewDetailsMock}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /View details/ }),
    );

    expect(onViewDetailsMock).toBeCalledTimes(1);
    expect(onViewDetailsMock).toHaveBeenCalledWith({
      providerId: certificates[0].providerID,
      certificate: certificates[0],
    });
  });

  it('Should handle downloadCertificate when Download button is clicked', async () => {
    render(
      <CertificatesList {...defaultProps} certificates={[certificates[0]]} />,
    );

    await userEvent.click(screen.getByLabelText(/Download certificate/));

    expect(downloadCertificate).toBeCalledTimes(1);
    expect(downloadCertificate).toHaveBeenCalledWith(
      certificates[0].subjectName,
      certificates[0].raw,
      certificates[0].type,
    );
  });

  it('Should copy certificate when Copy button is clicked', async () => {
    vi.spyOn(certificateUtils, 'certificateRawToPem').mockImplementation(
      vi.fn(),
    );

    render(
      <CertificatesList {...defaultProps} certificates={[certificates[0]]} />,
    );

    await userEvent.click(screen.getByLabelText(/Copy certificate/));

    expect(certificateUtils.certificateRawToPem).toBeCalledTimes(1);
    expect(certificateUtils.certificateRawToPem).toHaveBeenCalledWith(
      certificates[0].raw,
      certificates[0].type,
    );
  });

  it('Should clear currentRow state onMouseOver', async () => {
    render(
      <CertificatesList {...defaultProps} certificates={[certificates[0]]} />,
    );

    const row = screen.getByText(/Test 1/);

    fireEvent.focus(row);

    expect(row.closest('tr')).toHaveClass('current');

    fireEvent.mouseOver(row);
    expect(row.closest('tr')).not.toHaveClass('current');
  });
});
