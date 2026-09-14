import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, MenuDivider } from './Menu';
import { MenuItem } from './MenuItem';
import { Link, ArrowLeftRight, X } from 'lucide-react';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
};
export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <Menu style={{ width: 220 }}>
      <MenuItem icon={<Link />}>Copy link</MenuItem>
      <MenuItem icon={<ArrowLeftRight />}>Transfer</MenuItem>
      <MenuDivider />
      <MenuItem icon={<X />} destructive>
        Delete
      </MenuItem>
    </Menu>
  ),
};

export const WithSelection: Story = {
  render: () => (
    <Menu style={{ width: 220 }}>
      <MenuItem selected>Newest first</MenuItem>
      <MenuItem>Oldest first</MenuItem>
      <MenuItem>Alphabetical</MenuItem>
    </Menu>
  ),
};
