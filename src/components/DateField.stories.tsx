import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateField } from './DateField';

const meta: Meta<typeof DateField> = {
  title: 'Components/DateField',
  component: DateField,
};
export default meta;

type Story = StoryObj<typeof DateField>;

export const Default: Story = {
  args: { label: 'From', value: 'Oct 09', onChange: () => {} },
};

export const Placeholder: Story = {
  args: { label: 'From', placeholder: 'Pick a date', value: '', onChange: () => {} },
};

// Stands in for a real date picker: each click moves the date on by a day.
function ClickDemo() {
  const [day, setDay] = useState(9);
  return (
    <DateField
      label="From"
      value={`Oct ${String(day).padStart(2, '0')}`}
      onChange={() => {}}
      onClick={() => setDay((d) => (d % 31) + 1)}
    />
  );
}

export const Clickable: Story = {
  render: () => <ClickDemo />,
};

export const Disabled: Story = {
  args: { label: 'From', value: 'Oct 09', onChange: () => {}, disabled: true },
};
