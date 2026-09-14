import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Tag } from './Tag';
import styles from './Card.stories.module.css';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

function ShiftCardDemo() {
  return (
    <div className={styles.demo}>
      <div className={styles.title}>Milking — AM</div>
      <div className={styles.subtitle}>Green Valley Farm · Zone 3</div>
      <div className={styles.meta}>3 tasks · ~4h:15m</div>
      <div className={styles.tags}>
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
    <div className={styles.fluidWrap}>
      <Card interactive fluid>
        <ShiftCardDemo />
      </Card>
    </div>
  ),
};
