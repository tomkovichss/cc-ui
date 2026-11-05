import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Unchecked: Story = {
  args: { checked: false, ariaLabel: 'Example switch' },
};

export const Checked: Story = {
  args: { checked: true, ariaLabel: 'Example switch' },
};

export const Disabled: Story = {
  args: { checked: true, ariaLabel: 'Example switch', disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Switch checked size="sm" ariaLabel="Small switch" onChange={() => {}} />
      <Switch checked size="base" ariaLabel="Base switch" onChange={() => {}} />
    </div>
  ),
};

function InteractiveSwitch() {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} ariaLabel="Interactive switch" />;
}

export const Interactive: Story = {
  render: () => <InteractiveSwitch />,
  // Regression: the decorative track must not cover the <input>. userEvent skips hit-testing
  // (Playwright's click() does not), so assert what sits under the input's centre explicitly.
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch');
    const { left, top, width, height } = sw.getBoundingClientRect();
    await expect(document.elementFromPoint(left + width / 2, top + height / 2)).toBe(sw);
    await expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
  },
};

function WithLabelSwitch() {
  const [checked, setChecked] = useState(false);
  return (
    <Switch checked={checked} onChange={(e) => setChecked(e.target.checked)} label="Enable notifications" />
  );
}

export const WithLabel: Story = {
  render: () => <WithLabelSwitch />,
};
