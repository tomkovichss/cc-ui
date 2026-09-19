import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';
import { Dropdown } from './Dropdown';
import { Button } from './Button';
import { Search } from 'lucide-react';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { placeholder: 'e.g. Green Valley Farm' },
};

export const WithLabel: Story = {
  args: { label: 'Farm name', placeholder: 'e.g. Green Valley Farm' },
};

export const WithLeadingIcon: Story = {
  args: { placeholder: 'Search…', leadingIcon: <Search /> },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email.",
  },
};

export const WithError: Story = {
  args: {
    label: 'BPO number',
    placeholder: 'BPO-1234',
    error: 'This BPO number is already in use.',
  },
};

export const ToolbarStyle: Story = {
  args: {
    variant: 'toolbar',
    placeholder: 'Search by worker, BPO, or farm #',
    leadingIcon: <Search />,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
      <TextField size="sm" placeholder="Small" />
      <TextField size="base" placeholder="Base" />
    </div>
  ),
};

const rowOptions = [{ value: 'north', label: 'North paddock' }];

export const RowAlignment: Story = {
  name: 'Row alignment (TextField + Dropdown + Button)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(['sm', 'base'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <TextField size={size} placeholder={size} />
          <Dropdown size={size} options={rowOptions} value="north" onChange={() => {}} />
          <Button size={size}>Save</Button>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { label: 'Farm name', placeholder: 'Disabled', disabled: true },
};

function ControlledDemo() {
  const [value, setValue] = useState('');
  return <TextField label="Worker name" value={value} onChange={(e) => setValue(e.target.value)} />;
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
