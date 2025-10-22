import { render, screen } from '@testing';
import { HighlightedText } from './HighlightedText';

describe('<HighlightedText />', () => {
  const textMock = 'Test highlighting text';

  it('Should render text without highlighting', () => {
    render(
      <HighlightedText text={textMock} />,
    );

    expect(screen.getByText(textMock)).toBeInTheDocument();
  });

  it('Should render text with highlighting', () => {
    render(
      <HighlightedText text={textMock} highlight="highlighting" />,
    );

    expect(screen.getByText('highlighting').getAttribute('class')).toMatch(
      /highlight_text/,
    );
  });
});
