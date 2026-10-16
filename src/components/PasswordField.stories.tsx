import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordField } from './PasswordField';

const meta: Meta<typeof PasswordField> = {
  title: 'Components/PasswordField',
  component: PasswordField,
};
export default meta;

type Story = StoryObj<typeof PasswordField>;

export const Default: Story = {
  args: { label: 'Password', placeholder: 'Enter your password' },
};

function PinDemo() {
  const [pin, setPin] = useState('');
  return (
    <PasswordField
      label="Enter your PIN number"
      placeholder="Enter your PIN number"
      showLabel="Show PIN"
      hideLabel="Hide PIN"
      inputMode="numeric"
      value={pin}
      onChange={(e) => setPin(e.target.value)}
    />
  );
}

export const Pin: Story = {
  render: () => <PinDemo />,
};

export const WithError: Story = {
  args: { label: 'PIN', defaultValue: '1234', error: 'Wrong PIN, try again' },
};

export const Disabled: Story = {
  args: { label: 'PIN', defaultValue: '1234', disabled: true },
};
