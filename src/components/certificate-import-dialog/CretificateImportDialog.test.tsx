import {
  render, userEvent, fireEvent, act, screen,
} from '@testing';
import { ComponentProps } from 'react';
import { APP_CERTIFICATE_MAX_SIZE_BYTES } from '../../config';
import { CertificateImportDialog } from './CertificateImportDialog';

describe('<CertificateImportDialog />', () => {
  const defaultProps: ComponentProps<typeof CertificateImportDialog> = {
    certificate: '',
    isTextAreaError: false,
    providers: [],
    onDialogClose: vi.fn(),
    onClearButtonClick: vi.fn(),
    onTextAreaChange: vi.fn(),
    onTextAreaBlur: vi.fn(),
    onProviderSelect: vi.fn((data) => data),
    onImportButtonClick: vi.fn(),
    onDropError: vi.fn(),
    onDropRejected: vi.fn(),
    onDropAccepted: vi.fn(),
  };

  function getDropZone() {
    return screen
      .getByText(/Drag and drop certificate file here/)
      .closest('div') as Element;
  }

  it('Should handle back button', async () => {
    render(
      <CertificateImportDialog {...defaultProps} />,
    );

    await userEvent.click(screen.getAllByRole('button')[0]);

    expect(defaultProps.onDialogClose).toBeCalledTimes(1);
  });

  it('Should handle provider select', async () => {
    const providers = [
      {
        id: '1',
        name: 'Provider 1',
      },
      {
        id: '2',
        name: 'Provider 2',
      },
    ];

    render(
      <CertificateImportDialog
        {...defaultProps}
        currentProviderId={providers[0].id}
        providers={providers}
      />,
    );

    await userEvent.click(screen.getByText(providers[0].name));

    expect(screen.getAllByRole('presentation')[1]).toBeInTheDocument();

    const comboboxItems = screen.getAllByRole('option');

    expect(comboboxItems).toHaveLength(providers.length);

    await userEvent.click(comboboxItems[1]);

    expect(defaultProps.onProviderSelect).toBeCalledTimes(1);
    expect(defaultProps.onProviderSelect).toHaveReturnedWith(providers[1].id);
  });

  it('Should render loading', () => {
    render(
      <CertificateImportDialog {...defaultProps} loading={true} />,
    );

    expect(screen.getByText(/Importing certificate/)).toBeInTheDocument();
  });

  it('Should render with disabled Clear & Import button', async () => {
    render(
      <CertificateImportDialog {...defaultProps} />,
    );
    expect(screen.getByRole('button', { name: /Clear/ })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /Import certificate/ }),
    ).toBeDisabled();
  });

  it('Should handle Clear button', async () => {
    render(
      <CertificateImportDialog {...defaultProps} certificate="certificate" />,
    );

    await userEvent.click(screen.getByRole('button', { name: /Clear/ }));

    expect(defaultProps.onClearButtonClick).toBeCalledTimes(1);
  });

  it('Should handle import button', async () => {
    render(
      <CertificateImportDialog {...defaultProps} certificate="certificate" />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: /Import certificate/ }),
    );

    expect(defaultProps.onImportButtonClick).toBeCalledTimes(1);
  });

  it('Should handle textarea change & blur', async () => {
    render(
      <CertificateImportDialog {...defaultProps} />,
    );

    const textarea = screen.getByRole('textbox');

    const certificate = 'test';

    await userEvent.type(textarea, certificate);

    expect(defaultProps.onTextAreaChange).toBeCalledTimes(certificate.length);

    fireEvent.blur(textarea);
    expect(defaultProps.onTextAreaBlur).toBeCalledTimes(1);
  });

  it('Should show textarea validation error', async () => {
    render(
      <CertificateImportDialog {...defaultProps} isTextAreaError={true} />,
    );

    expect(
      screen.getByText(
        /Certificate is invalid. Please check your data and try again/,
      ),
    ).toBeInTheDocument();
  });

  it('Should handle a valid file drop correctly', async () => {
    const fileType = 'application/pkix-cert';
    const arrayBuffer = new TextEncoder().encode('file content').buffer;

    render(
      <CertificateImportDialog {...defaultProps} />,
    );

    const dropzone = getDropZone();

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [
            {
              name: 'file.cer',
              type: fileType,
              arrayBuffer: () => arrayBuffer,
            },
          ],
          types: ['Files'],
        },
      });
    });

    expect(defaultProps.onDropAccepted).toBeCalledTimes(1);
    expect(defaultProps.onDropAccepted).toBeCalledWith(
      arrayBuffer,
      'cer',
      fileType,
    );
  });

  it('Should handle onDropError correctly', async () => {
    const onDropErrorMock = vi.fn();

    render(
      <CertificateImportDialog
        {...defaultProps}
        onDropError={onDropErrorMock}
      />,
    );

    const dropzone = getDropZone();

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [
            {
              name: 'file.cer',
              type: 'application/pkix-cert',
              arrayBuffer: null,
            },
          ],
          types: ['Files'],
        },
      });
    });

    expect(onDropErrorMock).toBeCalledTimes(1);
  });

  it('Should handle file type rejection correctly', async () => {
    const onDropRejectedMock = vi.fn();

    render(
      <CertificateImportDialog
        {...defaultProps}
        onDropRejected={onDropRejectedMock}
      />,
    );

    const dropzone = getDropZone();

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [
            {
              name: 'file.exe',
              type: 'application/x-msdownload',
            },
          ],
          types: ['Files'],
        },
      });
    });

    expect(onDropRejectedMock).toBeCalledTimes(1);
    expect(onDropRejectedMock).toBeCalledWith(
      'Wrong file format. Use PEM or DER formats.',
    );
  });

  it('Should handle file maxSize rejection correctly', async () => {
    const onDropRejectedMock = vi.fn();

    render(
      <CertificateImportDialog
        {...defaultProps}
        onDropRejected={onDropRejectedMock}
      />,
    );

    const dropzone = getDropZone();

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [
            {
              name: 'file.cer',
              type: 'application/pkix-cert',
              size: APP_CERTIFICATE_MAX_SIZE_BYTES + 1,
            },
          ],
          types: ['Files'],
        },
      });
    });

    expect(onDropRejectedMock).toBeCalledTimes(1);
    expect(onDropRejectedMock).toBeCalledWith('File is larger than 5 Mb.');
  });

  it('Should handle multiple files rejection correctly', async () => {
    const onDropRejectedMock = vi.fn();

    render(
      <CertificateImportDialog
        {...defaultProps}
        onDropRejected={onDropRejectedMock}
      />,
    );

    const dropzone = getDropZone();

    await act(async () => {
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [
            {
              name: 'file1.cer',
              type: 'application/pkix-cert',
            },
            {
              name: 'file2.cer',
              type: 'application/pkix-cert',
            },
          ],
          types: ['Files'],
        },
      });
    });

    expect(onDropRejectedMock).toBeCalledTimes(1);
    expect(onDropRejectedMock).toBeCalledWith('You can select only one file.');
  });
});
