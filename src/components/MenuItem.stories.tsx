import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuItem } from './MenuItem';
import { Menu } from './Menu';
import { Link, X } from 'lucide-react';

const meta: Meta<typeof MenuItem> = {
  title: 'Components/MenuItem',
  component: MenuItem,
};
export default meta;

type Story = StoryObj<typeof MenuItem>;

export const Default: Story = {
  render: () => (
    <Menu style={{ width: 200 }}>
      <MenuItem>Edit</MenuItem>
    </Menu>
  ),
};

export const WithIconAndTrailing: Story = {
  render: () => (
    <Menu style={{ width: 200 }}>
      <MenuItem icon={<Link />} trailing="⌘L">
        Copy link
      </MenuItem>
    </Menu>
  ),
};

export const Selected: Story = {
  render: () => (
    <Menu style={{ width: 200 }}>
      <MenuItem selected>Selected item</MenuItem>
    </Menu>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Menu style={{ width: 200 }}>
      <MenuItem icon={<X />} destructive>
        Delete
      </MenuItem>
    </Menu>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Menu style={{ width: 200 }}>
      <MenuItem disabled>Disabled item</MenuItem>
    </Menu>
  ),
};
