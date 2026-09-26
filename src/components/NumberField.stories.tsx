import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberField } from './NumberField';

const meta: Meta<typeof NumberField> = {
  title: 'Components/NumberField',
  component: NumberField,
};
export default meta;

type Story = StoryObj<typeof NumberField>;

export const Default: Story = {
  args: { defaultValue: 1000 },
};

export const WithLabel: Story = {
  args: { label: 'Milking herd', defaultValue: 1000, suffix: 'cows' },
};

export const WithSuffix: Story = {
  args: { defaultValue: 80, suffix: 'lbs / per cow' },
};

export const WithPrefixAndSuffix: Story = {
  args: { defaultValue: 18.4, prefix: '$', suffix: 'cwt' },
};

export const WithHelperText: Story = {
  args: {
    label: 'Calf value',
    defaultValue: 1000,
    prefix: '$',
    suffix: 'per calf',
    helperText: '2026 Holstein mid ≈ $1,000',
  },
};

export const WithError: Story = {
  args: {
    label: 'Bulk-tank SCC',
    defaultValue: -50,
    suffix: 'k',
    error: 'Must be 0 or greater.',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 220 }}>
      <NumberField size="sm" defaultValue={1000} suffix="cows" />
      <NumberField size="base" defaultValue={1000} suffix="cows" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Milking herd', defaultValue: 1000, suffix: 'cows', disabled: true },
};

function ControlledDemo() {
  const [value, setValue] = useState(300);
  return (
    <NumberField
      label="Bulk-tank SCC"
      type="number"
      suffix="k"
      value={value}
      onChange={(e) => setValue(parseFloat(e.target.value))}
    />
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
