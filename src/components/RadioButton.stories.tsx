import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton, RadioGroup } from './RadioButton';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  component: RadioButton,
};
export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Unchecked: Story = {
  args: { checked: false, ariaLabel: 'Example radio' },
};

export const Checked: Story = {
  args: { checked: true, ariaLabel: 'Example radio' },
};

const items = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function RadioGroupDemo() {
  const [value, setValue] = useState('daily');
  return (
    <RadioGroup label="Cadence" name="cadence" items={items} value={value} onChange={setValue} />
  );
}

export const Group: Story = {
  render: () => <RadioGroupDemo />,
};
