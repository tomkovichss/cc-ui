import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from './Toolbar';
import { Button } from './Button';
import { Tag } from './Tag';

const meta: Meta<typeof Toolbar> = {
  title: 'Components/Toolbar',
  component: Toolbar,
};
export default meta;

type Story = StoryObj<typeof Toolbar>;

function ToolbarDemo() {
  const [search, setSearch] = useState('');
  return (
    <div style={{ width: 640 }}>
      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by worker, BPO, or farm #"
      >
        <Button variant="tertiary" size="sm">
          Sort
        </Button>
        <Button variant="tertiary" size="sm">
          Filters
        </Button>
      </Toolbar>
    </div>
  );
}

export const Default: Story = {
  render: () => <ToolbarDemo />,
};

export const NoShortcutBadge: Story = {
  render: () => (
    <div style={{ width: 640 }}>
      <Toolbar placeholder="Search…" shortcutLabel="">
        <Tag variant="count">3</Tag>
      </Toolbar>
    </div>
  ),
};

export const SearchOnly: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <Toolbar placeholder="Search…" />
    </div>
  ),
};
