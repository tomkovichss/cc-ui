import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox, CheckboxGroup } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { checked: false, ariaLabel: 'Example checkbox' },
};

export const Checked: Story = {
  args: { checked: true, ariaLabel: 'Example checkbox' },
};

export const Disabled: Story = {
  args: { checked: false, ariaLabel: 'Example checkbox', label: 'Unavailable option', disabled: true },
};

export const DisabledChecked: Story = {
  args: { checked: true, ariaLabel: 'Example checkbox', label: 'Locked option', disabled: true },
};

function InteractiveCheckbox() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} ariaLabel="Interactive checkbox" />;
}

export const Interactive: Story = {
  render: () => <InteractiveCheckbox />,
  // Regression guard: the input must be the topmost element at its centre (userEvent skips hit-testing).
  play: async ({ canvasElement }) => {
    const el = within(canvasElement).getByRole('checkbox');
    const { left, top, width, height } = el.getBoundingClientRect();
    await expect(document.elementFromPoint(left + width / 2, top + height / 2)).toBe(el);
    await expect(el).not.toBeChecked();
    await userEvent.click(el);
    await expect(el).toBeChecked();
  },
};

function WithLabelCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="Send me email updates" />
  );
}

export const WithLabel: Story = {
  render: () => <WithLabelCheckbox />,
};

const items = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push notifications' },
];

function CheckboxGroupDemo() {
  const [value, setValue] = useState<string[]>(['email']);
  return <CheckboxGroup label="Notify me via" items={items} value={value} onChange={setValue} />;
}

export const Group: Story = {
  render: () => <CheckboxGroupDemo />,
};
