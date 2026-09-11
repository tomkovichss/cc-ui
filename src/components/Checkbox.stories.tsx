import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

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

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} ariaLabel="Interactive checkbox" />;
  },
};
