import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
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

export const Disabled: Story = {
  args: { checked: false, ariaLabel: 'Example radio', label: 'Unavailable option', disabled: true },
};

export const DisabledChecked: Story = {
  args: { checked: true, ariaLabel: 'Example radio', label: 'Locked option', disabled: true },
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
  // Regression guard: every radio input must be the topmost element at its centre.
  play: async ({ canvasElement }) => {
    const radios = within(canvasElement).getAllByRole('radio');
    for (const r of radios) {
      const { left, top, width, height } = r.getBoundingClientRect();
      await expect(document.elementFromPoint(left + width / 2, top + height / 2)).toBe(r);
    }
    await expect(radios[0]).toBeChecked();
    await userEvent.click(radios[1]);
    await expect(radios[1]).toBeChecked();
    await expect(radios[0]).not.toBeChecked();
  },
};
