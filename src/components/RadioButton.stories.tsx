import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioButton } from './RadioButton';

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

function RadioGroupDemo() {
  const options = ['Daily', 'Weekly', 'Monthly'] as const;
  const [selected, setSelected] = useState<(typeof options)[number]>('Daily');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((opt) => (
        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <RadioButton
            checked={selected === opt}
            onChange={() => setSelected(opt)}
            name="cadence"
            value={opt}
            ariaLabel={opt}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

export const Group: Story = {
  render: () => <RadioGroupDemo />,
};
