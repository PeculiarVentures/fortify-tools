import {
  render, userEvent, screen,
} from '@testing';
import { CertificateCreateByCname } from './CertificateCreateByCname';

describe('<CertificateCreateByCname />', () => {
  const createDataResult = {
    subject: { CN: 'example.com' },
    algorithm: {
      hash: 'SHA-256', signature: 'EC-P256',
    },
    type: 'x509',
  };

  it('Should render & submit', async () => {
    const onCreateButtonClickMock = vi.fn((data) => data);

    render(
      <CertificateCreateByCname
        type="x509"
        onCreateButtonClick={onCreateButtonClickMock}
      />,
    );

    const buttonElement = screen.getByRole('button', { name: 'Create certificate' });

    expect(buttonElement).toBeDisabled();

    await userEvent.type(
      screen.getByRole('textbox', { name: 'Common name' }),
      createDataResult.subject.CN,
    );

    await userEvent.click(buttonElement);

    expect(onCreateButtonClickMock).toBeCalledTimes(1);
    expect(onCreateButtonClickMock).toHaveReturnedWith(createDataResult);
  });
});
