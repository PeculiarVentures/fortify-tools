import { render, screen } from '@testing';
import { UpdateClient } from './UpdateClient';

vi.mock('../../icons/update-app.svg?react', () => ({ default: () => <svg data-testid="update_app_icon" /> }));

describe('<UpdateClient />', () => {
  it('Should render', () => {
    render(
      <UpdateClient />,
    );

    expect(screen.getByTestId('update_app_icon')).toBeInTheDocument();

    expect(
      screen.getByText(/Update your local Fortify application/),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Your current version is outdated. Please go to your local Fortify application settings and check for updates/,
      ),
    ).toBeInTheDocument();
  });
});
