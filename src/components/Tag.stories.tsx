import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Mon 9/15' },
};

export const Pill: Story = {
  args: { variant: 'pill', children: 'Acme BPO' },
};

export const Accent: Story = {
  args: { variant: 'accent', children: '4h:30m current' },
};

export const Success: Story = {
  args: { variant: 'success', children: '2h:10m spent' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'ASAP' },
};

export const Count: Story = {
  args: { variant: 'count', children: 3 },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Tag variant="neutral">Mon 9/15</Tag>
      <Tag variant="pill">Acme BPO</Tag>
      <Tag variant="accent">4h:30m current</Tag>
      <Tag variant="success">2h:10m spent</Tag>
      <Tag variant="danger">ASAP</Tag>
      <Tag variant="count">3</Tag>
    </div>
  ),
};
