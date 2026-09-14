import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowUpDown, Filter } from 'lucide-react';
import { Toolbar } from './Toolbar';
import { Button } from './Button';

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
        <Button variant="tertiary" size="base" leadingIcon={<ArrowUpDown />}>
          Sort
        </Button>
        <Button variant="tertiary" size="base" leadingIcon={<Filter />}>
          Filters
        </Button>
      </Toolbar>
    </div>
  );
}

export const Default: Story = {
  render: () => <ToolbarDemo />,
};
