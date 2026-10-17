import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
};
export default meta;

type Story = StoryObj<typeof Spinner>;

const Frame = ({ children, size = 160 }: { children: React.ReactNode; size?: number }) => (
  <div style={{ position: 'relative', width: size, height: size }}>{children}</div>
);

export const Default: Story = {
  render: (args) => (
    <Frame>
      <Spinner {...args} />
    </Frame>
  ),
};

export const Subtle: Story = {
  args: { variant: 'subtle' },
  render: (args) => (
    <Frame>
      <Spinner {...args} />
    </Frame>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {[24, 40, 64].map((size) => (
        <Frame key={size} size={96}>
          <Spinner size={size} />
        </Frame>
      ))}
    </div>
  ),
};

export const OnSurface: Story = {
  render: () => (
    <div style={{ position: 'relative', background: 'var(--bg)', width: 240, height: 160, borderRadius: 12 }}>
      <Spinner variant="subtle" />
    </div>
  ),
};
