import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Tag } from './Tag';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

function ShiftCardDemo() {
  return (
    <div style={{ fontFamily: 'inherit' }}>
      <div style={{ fontWeight: 500, fontSize: '0.92rem' }}>Milking — AM</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
        Green Valley Farm · Zone 3
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 6 }}>3 tasks · ~4h:15m</div>
      <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Tag variant="danger">ASAP</Tag>
        <Tag variant="neutral">Mon 9/15</Tag>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Card interactive>
      <ShiftCardDemo />
    </Card>
  ),
};

export const Completed: Story = {
  render: () => (
    <Card interactive completed>
      <ShiftCardDemo />
    </Card>
  ),
};

export const Stacked: Story = {
  render: () => (
    <Card interactive draggable stacked>
      <ShiftCardDemo />
    </Card>
  ),
};

export const Fluid: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Card interactive fluid>
        <ShiftCardDemo />
      </Card>
    </div>
  ),
};
