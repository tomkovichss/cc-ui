import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
  LinkIconSvg,
  CloseIconSvg,
  FilterIcon,
  TransferIconSvg,
} from './icons';

const ICONS = {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
  LinkIconSvg,
  CloseIconSvg,
  FilterIcon,
  TransferIconSvg,
};

const meta: Meta = {
  title: 'Components/Icons',
};
export default meta;

type Story = StoryObj;

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {Object.entries(ICONS).map(([name, Icon]) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 90 }}>
          <div style={{ width: 24, height: 24 }}>
            <Icon />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
