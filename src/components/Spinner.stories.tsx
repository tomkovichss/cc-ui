import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {},
};

export const Subtle: Story = {
  args: { variant: 'subtle' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Spinner size={24} />
      <Spinner size={40} />
      <Spinner size={64} />
    </div>
  ),
};

export const OnSurface: Story = {
  render: () => (
    <div style={{ background: 'var(--bg)', padding: 32, borderRadius: 12 }}>
      <Spinner variant="subtle" />
    </div>
  ),
};
