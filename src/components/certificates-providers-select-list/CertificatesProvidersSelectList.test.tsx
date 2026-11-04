import { render, userEvent, screen } from '@testing';
import { CertificatesProvidersSelectList } from './CertificatesProvidersSelectList';

describe('<CertificatesProvidersSelectList />', () => {
  it('Should render & handel select', async () => {
    const onSelectMock = vi.fn((data) => data);

    const providers = [
      {
        id: '1',
        name: 'Provider 1',
        readOnly: false,
      },
      {
        id: '2',
        name: 'Provider 2',
        readOnly: false,
      },
    ];

    render(
      <CertificatesProvidersSelectList
        providers={providers}
        className="test_combobox"
        popoverClassName="test_combobox_popup"
        currentProviderId={providers[0].id}
        onSelect={onSelectMock}
      />,
    );

    const combobox = screen.getByRole('combobox');

    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveTextContent(providers[0].name);
    expect(combobox.parentElement).toHaveClass('test_combobox');

    await userEvent.click(combobox);

    const comboboxPopup = screen.getByRole('presentation');

    expect(comboboxPopup).toBeInTheDocument();

    expect(comboboxPopup.querySelector('.test_combobox_popup')).toBeInTheDocument();

    const comboboxItems = screen.getAllByRole('option');

    expect(comboboxItems).toHaveLength(2);

    await userEvent.click(comboboxItems[1]);

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

    expect(onSelectMock).toBeCalledTimes(1);
    expect(onSelectMock).toHaveReturnedWith(providers[1].id);
  });

  it('Should mark read-only providers', () => {
    render(
      <CertificatesProvidersSelectList
        providers={[{ id: '1', name: 'Token', readOnly: true }]}
        currentProviderId="1"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Token (Read only)');
  });
});
