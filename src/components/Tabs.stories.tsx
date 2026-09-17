import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { List, Grid, Settings } from 'lucide-react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  argTypes: {
    items: { control: false },
    onChange: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const items = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

export const Line: Story = {
  render: () => {
    const [value, setValue] = useState('all');
    return <Tabs items={items} value={value} onChange={setValue} variant="line" />;
  },
};

export const Box: Story = {
  render: () => {
    const [value, setValue] = useState('all');
    return <Tabs items={items} value={value} onChange={setValue} variant="box" />;
  },
};

export const BoxSm: Story = {
  name: 'Box - Small',
  render: () => {
    const [value, setValue] = useState('all');
    return <Tabs items={items} value={value} onChange={setValue} variant="box" size="sm" />;
  },
};

export const WithIcons: Story = {
  render: () => {
    const iconItems = [
      { value: 'list', label: 'List', icon: <List /> },
      { value: 'grid', label: 'Grid', icon: <Grid /> },
      { value: 'settings', label: 'Settings', icon: <Settings /> },
    ];
    const [value, setValue] = useState('list');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Tabs items={iconItems} value={value} onChange={setValue} variant="line" />
        <Tabs items={iconItems} value={value} onChange={setValue} variant="box" />
      </div>
    );
  },
};

export const WithDisabled: Story = {
  render: () => {
    const disabledItems = [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
      { value: 'archived', label: 'Archived', disabled: true },
    ];
    const [value, setValue] = useState('all');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Tabs items={disabledItems} value={value} onChange={setValue} variant="line" />
        <Tabs items={disabledItems} value={value} onChange={setValue} variant="box" />
      </div>
    );
  },
};

export const AllVariants: Story = {
  name: 'All - Variants',
  render: () => {
    const [value, setValue] = useState('all');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Tabs items={items} value={value} onChange={setValue} variant="line" />
        <Tabs items={items} value={value} onChange={setValue} variant="box" />
      </div>
    );
  },
};
