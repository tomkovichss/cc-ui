import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterSection } from './FilterSection';

const meta: Meta<typeof FilterSection> = {
  title: 'Components/FilterSection',
  component: FilterSection,
};
export default meta;

type Story = StoryObj<typeof FilterSection>;

const OPTIONS = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];

function toggleInSet(prev: Set<string>, opt: string): Set<string> {
  const next = new Set(prev);
  if (next.has(opt)) {
    next.delete(opt);
  } else {
    next.add(opt);
  }
  return next;
}

function DefaultDemo() {
  const [active, setActive] = useState(new Set(['Alpha']));
  return (
    <div style={{ width: 260 }}>
      <FilterSection
        label="Farms"
        options={OPTIONS}
        optionLabel={(o) => o}
        activeSet={active}
        onToggle={(opt) => setActive((prev) => toggleInSet(prev, opt))}
        onSetAll={(opts) => setActive(new Set(opts))}
      />
    </div>
  );
}

function SearchableDemo() {
  const [active, setActive] = useState(new Set<string>());
  return (
    <div style={{ width: 260 }}>
      <FilterSection
        label="Workers"
        options={OPTIONS}
        optionLabel={(o) => o}
        activeSet={active}
        onToggle={(opt) => setActive((prev) => toggleInSet(prev, opt))}
        searchable
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <DefaultDemo />,
};

export const Searchable: Story = {
  render: () => <SearchableDemo />,
};
