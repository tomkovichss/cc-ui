import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Decorative placeholder (`aria-hidden`). Mark the loading region with `aria-busy="true"` and, if needed, a visually hidden `role="status"` text in the consumer. The pulse is disabled under `prefers-reduced-motion: reduce`, leaving a static block.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['rect', 'text', 'circle'] },
    width: { control: 'text' },
    height: { control: 'text' },
    size: { control: 'text' },
    animated: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {
  args: { variant: 'rect', width: 240, height: 16, animated: true },
};

const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 24 };

export const Variants: Story = {
  render: () => (
    <div style={row}>
      <Skeleton variant="rect" width={160} height={48} />
      <div style={{ width: 160 }}>
        <Skeleton variant="text" />
      </div>
      <Skeleton variant="circle" size={48} />
    </div>
  ),
};

const page: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 320px)',
  gap: 24,
  alignItems: 'start',
  padding: 24,
  background: 'var(--bg)',
};
const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 20,
  background: '#fff',
  borderRadius: 12,
};
const stack = (gap: number): CSSProperties => ({ display: 'flex', flexDirection: 'column', gap });

function Region({ children }: { children: ReactNode }) {
  return (
    <div style={page} aria-busy="true">
      {children}
    </div>
  );
}

function FeedCard() {
  return (
    <div style={card}>
      <div style={{ ...row, gap: 12 }}>
        <Skeleton variant="circle" size={40} />
        <div style={{ ...stack(8), flex: 1 }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <div style={stack(8)}>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
      </div>
    </div>
  );
}

export const Composition: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <Region>
      <div style={card}>
        <Skeleton height={96} />
        <div style={{ ...stack(12), alignItems: 'center', marginTop: -48 }}>
          <Skeleton variant="circle" size={96} />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="30%" />
        </div>
      </div>
      <div style={stack(24)}>
        <FeedCard />
        <FeedCard />
      </div>
      <div style={card}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ ...row, gap: 12 }}>
            <Skeleton width={48} height={48} />
            <div style={{ ...stack(8), flex: 1 }}>
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="45%" />
            </div>
          </div>
        ))}
      </div>
    </Region>
  ),
};
