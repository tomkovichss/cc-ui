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

export const Default: Story = {
  render: () => {
    const [active, setActive] = useState(new Set(['Alpha']));
    const toggle = (opt: string) => {
      setActive((prev) => {
        const next = new Set(prev);
        next.has(opt) ? next.delete(opt) : next.add(opt);
        return next;
      });
    };
    return (
      <div style={{ width: 260 }}>
        <FilterSection
          label="Farms"
          options={OPTIONS}
          optionLabel={(o) => o}
          activeSet={active}
          onToggle={toggle}
          onSetAll={(opts) => setActive(new Set(opts))}
        />
      </div>
    );
  },
};

export const Searchable: Story = {
  render: () => {
    const [active, setActive] = useState(new Set<string>());
    const toggle = (opt: string) => {
      setActive((prev) => {
        const next = new Set(prev);
        next.has(opt) ? next.delete(opt) : next.add(opt);
        return next;
      });
    };
    return (
      <div style={{ width: 260 }}>
        <FilterSection
          label="Workers"
          options={OPTIONS}
          optionLabel={(o) => o}
          activeSet={active}
          onToggle={toggle}
          searchable
        />
      </div>
    );
  },
};
