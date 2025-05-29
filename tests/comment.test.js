import renderer from 'react-test-renderer';
import Comment from '../components/atoms/comment.js';
import { Text } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(),
}));

jest.mock('date-fns/locale', () => ({
  es: {},
}));

describe('Test component Comment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Given user, date y text then renderiza user, relativeTime y text', () => {
    const user = 'Alice';
    const date = '2025-05-20T10:00:00Z';
    const text = 'Este es un comentario';
    formatDistanceToNow.mockReturnValueOnce('hace 2 días');

    const tree = renderer.create(
      <Comment user={user} date={date} text={text} locale={es} />,
    );

    const textNodes = tree.root.findAllByType(Text);

    expect(formatDistanceToNow).toHaveBeenCalledWith(new Date(date), {
      addSuffix: true,
      locale: es,
    });

    expect(textNodes.length).toBe(3);
    expect(textNodes[0].props.children).toBe(user);
    expect(textNodes[1].props.children).toBe('hace 2 días');
    expect(textNodes[2].props.children).toBe(text);
  });
});
