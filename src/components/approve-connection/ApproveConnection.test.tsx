import { render, screen } from '@testing';
import { ApproveConnection } from './ApproveConnection';

vi.mock('../../icons/fortify.svg?react', () => ({ default: () => <svg data-testid="fortify_icon" /> }));

describe('<ApproveConnection />', () => {
  it('Should render', () => {
    const challenge = 'ABCDF';

    render(
      <ApproveConnection challenge={challenge} />,
    );

    expect(screen.getByTestId('fortify_icon')).toBeInTheDocument();

    expect(screen.getByText(/Fortify authorization/)).toBeInTheDocument();

    challenge.split('').forEach((char) => {
      expect(screen.getByRole('heading', { name: char })).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        /Compare this code to the one shown by your operating system for Fortify/,
      ),
    ).toBeInTheDocument();
  });

  it('Shouldn\'t render challenge', () => {
    render(
      <ApproveConnection challenge="" />,
    );

    expect(screen.queryByRole('heading', { name: '' })).not.toBeInTheDocument();
  });
});
