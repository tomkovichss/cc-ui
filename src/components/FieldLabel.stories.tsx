import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldLabel } from './FieldLabel';
import { TextField } from './TextField';
import { Dropdown } from './Dropdown';
import { CheckboxGroup } from './Checkbox';
import { RadioGroup } from './RadioButton';

const meta: Meta<typeof FieldLabel> = {
  title: 'Components/FieldLabel',
  component: FieldLabel,
};
export default meta;

type Story = StoryObj<typeof FieldLabel>;

export const Default: Story = {
  args: { children: 'Farm name' },
};

const dropdownOptions = [
  { value: 'north', label: 'North paddock' },
  { value: 'south', label: 'South paddock' },
];

export const UsedAcrossComponents: Story = {
  name: 'Shared across TextField, Dropdown, and option groups',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: 280 }}>
      <TextField label="Farm name" placeholder="e.g. Green Valley Farm" />
      <Dropdown label="Paddock" options={dropdownOptions} value="north" onChange={() => {}} />
      <CheckboxGroup
        label="Notify me about"
        items={[
          { value: 'weather', label: 'Weather alerts' },
          { value: 'health', label: 'Herd health' },
        ]}
        value={['weather']}
        onChange={() => {}}
      />
      <RadioGroup
        label="Billing cycle"
        name="billing-cycle"
        items={[
          { value: 'monthly', label: 'Monthly' },
          { value: 'annual', label: 'Annual' },
        ]}
        value="monthly"
        onChange={() => {}}
      />
    </div>
  ),
};
