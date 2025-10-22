import { render, screen } from '@testing';
import { CertificateName } from './CertificateName';

describe('<CertificateName />', () => {
  it('Should render', () => {
    render(
      <CertificateName name="Test certificate" />,
    );

    expect(screen.getByText(/Test certificate/)).toBeInTheDocument();
  });

  it('Should render with highlighted text', () => {
    render(
      <CertificateName name="Test certificate" highlight="rtifi" />,
    );

    const highlightElement = screen.getByText(/rtifi/);

    expect(highlightElement).toBeInTheDocument();
    expect(highlightElement.getAttribute('class')).toMatch('highlight_text');
  });

  it('Should render with className', () => {
    render(
      <CertificateName name="Test certificate" className="test_class_name" />,
    );

    expect(screen.getByText(/Test certificate/)).toHaveClass('test_class_name');
  });

  it('Shouldn\'t render if no name', () => {
    const { container } = render(
      <CertificateName />,
    );

    expect(container.firstChild).toBeNull();
  });
});
