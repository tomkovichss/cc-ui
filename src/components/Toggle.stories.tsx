import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LayoutGrid, List } from 'lucide-react';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  argTypes: {
    items: { control: false },
    onChange: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Toggle>;

const iconItems = [
  { value: 'grid', icon: <LayoutGrid />, 'aria-label': 'Grid view' },
  { value: 'list', icon: <List />, 'aria-label': 'List view' },
];

export const IconsWithLabel: Story = {
  name: 'Icons with label',
  render: () => {
    const [value, setValue] = useState('list');
    return <Toggle label="View:" items={iconItems} value={value} onChange={setValue} />;
  },
};

export const Icons: Story = {
  render: () => {
    const [value, setValue] = useState('grid');
    return <Toggle aria-label="View" items={iconItems} value={value} onChange={setValue} />;
  },
};

const textItems = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const iconTextItems = [
  { value: 'grid', icon: <LayoutGrid />, label: 'Grid' },
  { value: 'list', icon: <List />, label: 'List' },
];

export const Text: Story = {
  render: () => {
    const [value, setValue] = useState('week');
    return <Toggle aria-label="Period" items={textItems} value={value} onChange={setValue} />;
  },
};

export const TextWithLabel: Story = {
  name: 'Text with label',
  render: () => {
    const [value, setValue] = useState('week');
    return <Toggle label="Period:" items={textItems} value={value} onChange={setValue} />;
  },
};

export const IconAndText: Story = {
  name: 'Icon + text',
  render: () => {
    const [value, setValue] = useState('grid');
    return <Toggle aria-label="View" items={iconTextItems} value={value} onChange={setValue} />;
  },
};

export const IconAndTextWithLabel: Story = {
  name: 'Icon + text with label',
  render: () => {
    const [value, setValue] = useState('grid');
    return <Toggle label="View:" items={iconTextItems} value={value} onChange={setValue} />;
  },
};
