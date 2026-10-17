import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Confirm',
  },
  argTypes: {
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const AllIconButtons: Story = {
  name: 'All - Icon Buttons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="primary" size="sm" leadingIcon={<Plus />} aria-label="Add" />
        <Button variant="primary" size="base" leadingIcon={<Plus />} aria-label="Add" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="secondary" size="sm" leadingIcon={<Plus />} aria-label="Add" />
        <Button variant="secondary" size="base" leadingIcon={<Plus />} aria-label="Add" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="tertiary" size="sm" leadingIcon={<Plus />} aria-label="Add" />
        <Button variant="tertiary" size="base" leadingIcon={<Plus />} aria-label="Add" />
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="dangerous" size="sm" leadingIcon={<Plus />} aria-label="Add" />
        <Button variant="dangerous" size="base" leadingIcon={<Plus />} aria-label="Add" />
      </div>
    </div>
  ),
};

const sizes = ['base', 'sm', 'xs'] as const;
const variants = ['primary', 'secondary', 'outline', 'tertiary', 'dangerous', 'onDark'] as const;
const rows = [...variants.map((variant) => ({ variant, disabled: false })), { variant: 'primary' as const, disabled: true }];

export const FigmaMatrix: Story = {
  name: 'All - Variants × Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {rows.map(({ variant, disabled }) => (
        <div
          key={`${variant}-${disabled}`}
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            padding: 16,
            background: variant === 'onDark' ? '#000' : undefined,
          }}
        >
          {sizes.map((size) => (
            <Button key={size} variant={variant} size={size} disabled={disabled} leadingIcon={<Plus />} trailingIcon={<ArrowRight />}>
              Button
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary', children: 'Cancel' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Cancel' },
};

export const OnDark: Story = {
  args: { variant: 'onDark', children: 'Cancel' },
  decorators: [
    (Story) => (
      <div style={{ background: '#000', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export const Dangerous: Story = {
  args: { variant: 'dangerous', children: 'Delete farm' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
};

export const WithLeadingIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button variant="primary" leadingIcon={<Plus />}>
        Add worker
      </Button>
      <Button variant="secondary" leadingIcon={<Plus />}>
        Add worker
      </Button>
      <Button variant="tertiary" leadingIcon={<Plus />}>
        Add worker
      </Button>
    </div>
  ),
};

export const WithTrailingIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button variant="primary" trailingIcon={<ArrowRight />}>
        Continue
      </Button>
      <Button variant="secondary" trailingIcon={<ArrowRight />}>
        Continue
      </Button>
      <Button variant="tertiary" trailingIcon={<ArrowRight />}>
        Continue
      </Button>
    </div>
  ),
};

export const WithBothIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button variant="primary" leadingIcon={<Plus />} trailingIcon={<ArrowRight />}>
        Add worker
      </Button>
      <Button variant="secondary" leadingIcon={<Plus />} trailingIcon={<ArrowRight />}>
        Add worker
      </Button>
      <Button variant="tertiary" leadingIcon={<Plus />} trailingIcon={<ArrowRight />}>
        Add worker
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Button variant="primary" fullWidth>
        Save changes
      </Button>
      <Button variant="secondary" fullWidth>
        Cancel
      </Button>
    </div>
  ),
};
