import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagGroup } from './TagGroup';

const meta: Meta<typeof TagGroup> = {
  title: 'Components/TagGroup',
  component: TagGroup,
  argTypes: {
    items: { control: false },
    onChange: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof TagGroup>;

const items = [
  { value: 'beef', label: 'Beef' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'calves', label: 'Calves' },
  { value: 'bulls', label: 'Bulls' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(['beef']);
    return <TagGroup items={items} value={value} onChange={setValue} />;
  },
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState(['beef']);
    return <TagGroup items={items} value={value} onChange={setValue} size="sm" />;
  },
};

export const WithLabel: Story = {
  render: () => {
    const cadenceItems = [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly' },
    ];
    const [value, setValue] = useState(['daily']);
    return <TagGroup items={cadenceItems} value={value} onChange={setValue} label="Cadence" />;
  },
};

export const WithDisabledItem: Story = {
  render: () => {
    const disabledItems = [
      { value: 'beef', label: 'Beef' },
      { value: 'dairy', label: 'Dairy' },
      { value: 'calves', label: 'Calves', disabled: true },
    ];
    const [value, setValue] = useState(['beef']);
    return <TagGroup items={disabledItems} value={value} onChange={setValue} />;
  },
};

export const DisabledGroup: Story = {
  render: () => {
    const [value, setValue] = useState(['beef']);
    return <TagGroup items={items} value={value} onChange={setValue} disabled />;
  },
};

export const AllVariants: Story = {
  name: 'All - Variants',
  render: () => {
    const [value, setValue] = useState(['beef']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <TagGroup items={items} value={value} onChange={setValue} />
        <TagGroup items={items} value={value} onChange={setValue} size="sm" />
        <TagGroup items={items} value={value} onChange={setValue} disabled />
      </div>
    );
  },
};
