import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Calendar>;

function Controlled({ initial = null, ...props }: Omit<ComponentProps<typeof Calendar>, 'value' | 'onChange'> & { initial?: Date | null }) {
  const [value, setValue] = useState<Date | null>(initial);
  return <Calendar {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: (args) => <Controlled {...args} initial={new Date(2026, 9, 3)} />,
};

export const NoValue: Story = {
  render: (args) => <Controlled {...args} />,
};

export const WithMinMax: Story = {
  render: (args) => (
    <Controlled {...args} initial={new Date(2026, 9, 15)} minDate={new Date(2026, 9, 8)} maxDate={new Date(2026, 10, 12)} />
  ),
};

export const Spanish: Story = {
  render: (args) => <Controlled {...args} initial={new Date(2026, 9, 3)} locale="es" weekStartsOn={1} />,
};
