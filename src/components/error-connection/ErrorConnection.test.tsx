import { render, screen } from '@testing';
import { ErrorConnection } from './ErrorConnection';

vi.mock('../../icons/error-big.svg?react', () => ({ default: () => <svg data-testid="error_icon" /> }));

describe('<ErrorConnection />', () => {
  const defaultProps = {
    message: 'Message',
    description: 'Description',
  };

  it('Should render', () => {
    render(
      <ErrorConnection {...defaultProps} />,
    );

    expect(screen.getByTestId('error_icon')).toBeInTheDocument();

    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
  });
});
