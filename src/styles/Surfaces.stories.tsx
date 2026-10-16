import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './Surfaces.stories.module.css';

type Level = {
  name: string;
  description: string;
  exampleStyle: React.CSSProperties;
  code: string;
};

const levels: Level[] = [
  {
    name: 'Floating panels & modals',
    description:
      'Popovers, dropdowns, modals, and anything else that floats above the page. Solid white with a soft, spread-out shadow and no inset border — the depth is carried entirely by the shadow.',
    exampleStyle: {
      background: 'var(--card-surface)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
    },
    code: 'background: var(--card-surface);\nbox-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);\nborder-radius: 16px;',
  },
  {
    name: 'Cards & toolbars',
    description:
      'Content sitting directly on the body surface — cards, the toolbar, list rows. Solid white with a thin inset border plus a subtle shadow, used by Card and Toolbar today.',
    exampleStyle: {
      background: 'var(--card-surface)',
      boxShadow: 'inset 0 0 0 1px #efefef, 0 1px 2px rgba(16, 24, 32, 0.04)',
    },
    code: 'background: var(--card-surface);\nbox-shadow:\n  inset 0 0 0 1px #efefef,\n  0 1px 2px rgba(16, 24, 32, 0.04);\nborder-radius: 16px;',
  },
  {
    name: 'Body surface',
    description:
      'The page background everything else sits on. Light grey, no shadow — it\'s the base layer, not a raised surface.',
    exampleStyle: {
      background: 'var(--bg)',
      boxShadow: 'none',
    },
    code: 'background: var(--bg);',
  },
];

function SurfaceLevels() {
  return (
    <div className={styles.list}>
      {levels.map((level) => (
        <div key={level.name} className={styles.level}>
          <div className={styles.preview}>
            <div className={styles.example} style={level.exampleStyle}>
              Example
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{level.name}</div>
            <div className={styles.description}>{level.description}</div>
            <div className={styles.code}>{level.code}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const depthSteps = [2, 5, 10, 20, 50, 75];

function DepthScale() {
  return (
    <div className={styles.list}>
      <div className={styles.info}>
        <div className={styles.name}>Depth</div>
        <div className={styles.description}>
          Translucent dark overlays for hover/pressed states, wells, and fills that should read as
          slightly recessed. Because they are transparent, the same token works on any surface —
          shown here on the card surface and on the body surface.
        </div>
      </div>
      {[
        { label: 'On card surface', background: 'var(--card-surface)' },
        { label: 'On body surface', background: 'var(--bg)' },
      ].map((surface) => (
        <div key={surface.label}>
          <div className={styles.surfaceLabel}>{surface.label}</div>
          <div className={styles.depthRow} style={{ background: surface.background }}>
            {depthSteps.map((step) => (
              <div key={step} className={styles.depthItem}>
                <div className={styles.depthSwatch} style={{ background: `var(--depth-${step})` }} />
                <div className={styles.depthName}>--depth-{step}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.code}>background: var(--depth-5);</div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Surfaces',
};
export default meta;

type Story = StoryObj;

export const Levels: Story = {
  render: () => <SurfaceLevels />,
};

export const Depth: Story = {
  render: () => <DepthScale />,
};
