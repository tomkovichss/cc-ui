import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { MapPin, Tractor, Milk } from 'lucide-react';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

const paddocks = [
  { value: 'north', label: 'North paddock' },
  { value: 'south', label: 'South paddock' },
  { value: 'east', label: 'East paddock' },
  { value: 'west', label: 'West paddock', disabled: true },
];

function ControlledDemo() {
  const [value, setValue] = useState<string | undefined>('south');
  return (
    <Dropdown
      label="Paddock"
      options={paddocks}
      value={value}
      onChange={setValue}
      placeholder="Select a paddock…"
    />
  );
}

export const Default: Story = {
  render: () => <ControlledDemo />,
};

export const Placeholder: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return <Dropdown label="Paddock" options={paddocks} value={value} onChange={setValue} />;
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('cow');
    return (
      <Dropdown
        label="Animal type"
        value={value}
        onChange={setValue}
        options={[
          { value: 'cow', label: 'Dairy cow', icon: <Milk /> },
          { value: 'calf', label: 'Calf', icon: <Tractor /> },
          { value: 'pasture', label: 'Pasture', icon: <MapPin /> },
        ]}
      />
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Dropdown
        label="Herd"
        options={paddocks}
        value={value}
        onChange={setValue}
        helperText="Choose which herd this task applies to."
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Dropdown
        label="Herd"
        options={paddocks}
        value={value}
        onChange={setValue}
        error="A herd must be selected."
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('north');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 280 }}>
        <Dropdown size="sm" options={paddocks} value={value} onChange={setValue} />
        <Dropdown size="base" options={paddocks} value={value} onChange={setValue} />
        <Dropdown size="lg" options={paddocks} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: 'Paddock', options: paddocks, placeholder: 'Select a paddock…', disabled: true },
};
