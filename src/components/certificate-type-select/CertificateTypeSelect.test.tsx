import {
  render, userEvent, screen,
} from '@testing';
import { CertificateTypeSelect } from './CertificateTypeSelect';

describe('<CertificateTypeSelect />', () => {
  const items = [
    'S/MIME',
    'Code signing',
    'Document signing',
    'TLS Client Authentication',
    'TLS Server Authentication',
  ];

  it('Should render for x509 & handel change', async () => {
    const onChangeMock = vi.fn();
    const itemsX509 = [...items, 'Custom certificate'];

    render(
      <CertificateTypeSelect
        className="test_combobox"
        type="x509"
        onChange={onChangeMock}
      />,
    );

    const combobox = screen.getByRole('combobox');

    expect(combobox).toHaveTextContent(/Select type/);
    expect(combobox.parentElement).toHaveClass('test_combobox');

    await userEvent.click(combobox);

    expect(screen.getByRole('presentation')).toBeInTheDocument();

    const comboboxItems = screen.getAllByRole('option');

    expect(comboboxItems).toHaveLength(itemsX509.length);

    comboboxItems.forEach((item, index) => {
      expect(item).toHaveTextContent(itemsX509[index]);
    });

    await userEvent.click(comboboxItems[0]);

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

    expect(onChangeMock).toBeCalledTimes(1);
  });

  it('Should render for CSR & handel change', async () => {
    const onChangeMock = vi.fn();
    const itemsCSR = [...items, 'Custom CSR'];

    render(
      <CertificateTypeSelect type="csr" onChange={onChangeMock} />,
    );

    const combobox = screen.getByRole('combobox');

    await userEvent.click(combobox);

    expect(screen.getByRole('presentation')).toBeInTheDocument();

    const comboboxItems = screen.getAllByRole('option');

    expect(comboboxItems).toHaveLength(itemsCSR.length);

    comboboxItems.forEach((item, index) => {
      expect(item).toHaveTextContent(itemsCSR[index]);
    });

    await userEvent.click(comboboxItems[0]);

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

    expect(onChangeMock).toBeCalledTimes(1);
  });
});
