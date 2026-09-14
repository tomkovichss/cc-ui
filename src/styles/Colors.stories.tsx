import type { Meta, StoryObj } from '@storybook/react-vite';
import tokensRaw from './tokens.css?raw';
import styles from './Colors.stories.module.css';

const TOKEN_RE = /--([\w-]+):\s*([^;]+);/g;

function getTokens() {
  const tokens: { name: string; value: string }[] = [];
  for (const match of tokensRaw.matchAll(TOKEN_RE)) {
    const [, name, value] = match;
    if (name.endsWith('-rgb')) continue;
    tokens.push({ name: `--${name}`, value: value.trim() });
  }
  return tokens;
}

function ColorSwatches() {
  return (
    <div className={styles.grid}>
      {getTokens().map((token) => (
        <div key={token.name} className={styles.swatch}>
          <div className={styles.color} style={{ background: `var(${token.name})` }} />
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
  title: 'Foundations/Colors',
};
export default meta;

type Story = StoryObj;

export const Tokens: Story = {
  render: () => <ColorSwatches />,
};
