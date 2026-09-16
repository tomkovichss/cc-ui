import type { Meta, StoryObj } from '@storybook/react-vite';
import fontsRaw from './fonts.css?raw';
import styles from './Fonts.stories.module.css';

const TOKEN_RE = /--([\w-]+):\s*([^;]+);/g;

function getTokens() {
  const tokens: { name: string; value: string }[] = [];
  for (const match of fontsRaw.matchAll(TOKEN_RE)) {
    const [, name, value] = match;
    tokens.push({ name: `--${name}`, value: value.trim() });
  }
  return tokens;
}

function previewStyle(name: string): React.CSSProperties {
  if (name.startsWith('--font-family')) return { fontFamily: `var(${name})` };
  if (name.startsWith('--font-size')) return { fontSize: `var(${name})` };
  if (name.startsWith('--font-weight')) return { fontWeight: `var(${name})` as never };
  if (name.startsWith('--line-height')) {
    return { lineHeight: `var(${name})`, maxWidth: 220 };
  }
  return {};
}

function FontTokens() {
  return (
    <div className={styles.grid}>
      {getTokens().map((token) => (
        <div key={token.name} className={styles.card}>
          <div className={styles.preview} style={previewStyle(token.name)}>
            {token.name.startsWith('--line-height')
              ? 'The quick brown fox jumps over the lazy dog.'
              : 'Aa'}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{token.name}</div>
            <div className={styles.value}>{token.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Fonts',
};
export default meta;

type Story = StoryObj;

export const Tokens: Story = {
  render: () => <FontTokens />,
};
