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

export const AllButtons: Story = {
  name: 'All - Buttons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary" size="base">
          Base
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="secondary" size="sm">
          Small
        </Button>
        <Button variant="secondary" size="base">
          Base
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="tertiary" size="sm">
          Small
        </Button>
        <Button variant="tertiary" size="base">
          Base
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="dangerous" size="sm">
          Small
        </Button>
        <Button variant="dangerous" size="base">
          Base
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Button variant="primary" size="sm" disabled>
          Small
        </Button>
        <Button variant="primary" size="base" disabled>
          Base
        </Button>
      </div>
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

