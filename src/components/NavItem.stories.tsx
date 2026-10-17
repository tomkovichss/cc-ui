import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Activity,
  BarChart3,
  ChevronRight,
  Clock,
  FileChartLine,
  Film,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { NavItem, NavList } from './NavItem';

const meta: Meta<typeof NavItem> = {
  title: 'Components/NavItem',
  component: NavItem,
  decorators: [
    (Story) => (
      <div style={{ width: 292 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof NavItem>;

export const Default: Story = {
  args: { children: 'Efficiency' },
};

export const Active: Story = {
  args: { children: 'Milk Barn Workers', active: true, icon: <Users /> },
};

export const WithIcon: Story = {
  args: { children: 'Milk Barn Videos', icon: <Film /> },
};

export const WithTrailing: Story = {
  args: { children: 'Routines Quality', icon: <BarChart3 />, trailing: <ChevronRight size={16} /> },
};

export const LongLabel: Story = {
  args: {
    children: 'A very long section name that does not fit in the column',
    icon: <Star />,
    title: 'A very long section name that does not fit in the column',
  },
};

export const Disabled: Story = {
  args: { children: 'Special', icon: <Star />, disabled: true },
};

export const Hidden: Story = {
  render: () => (
    <NavList>
      <NavItem icon={<Users />}>Visible</NavItem>
      <NavItem icon={<Film />} hidden>
        Hidden (Calf Barn)
      </NavItem>
      <NavItem icon={<Clock />}>Also visible</NavItem>
    </NavList>
  ),
};

export const AsLink: Story = {
  args: { children: 'Efficiency', href: '#efficiency', icon: <FileChartLine /> },
};

function CustomLink({ to, ...rest }: { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={`#${to}`} {...rest} />;
}

export const AsCustomComponent: Story = {
  render: () => (
    <NavItem as={CustomLink} {...{ to: '/efficiency' }} icon={<FileChartLine />}>
      Router link
    </NavItem>
  ),
};

const sections = [
  { id: 'workers', label: 'Workers', icon: <Users /> },
  { id: 'videos', label: 'Videos', icon: <Film /> },
  { id: 'efficiency', label: 'Efficiency', icon: <FileChartLine /> },
  { id: 'routines', label: 'Routines Quality', icon: <BarChart3 /> },
  { id: 'general', label: 'General performance', icon: <TrendingUp /> },
  { id: 'prep', label: 'Prep Lag Time', icon: <Clock /> },
];

function Sidebar() {
  const [current, setCurrent] = useState('workers');
  return (
    <nav aria-label="Report sections">
      <NavList>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <NavItem icon={s.icon} active={current === s.id} onClick={() => setCurrent(s.id)}>
                {s.label}
              </NavItem>
            </li>
          ))}
        </ul>
      </NavList>
    </nav>
  );
}

export const SidebarExample: Story = {
  render: () => <Sidebar />,
};

export const FiveItems: Story = {
  name: 'List of 5 items',
  render: () => (
    <nav aria-label="Report sections">
      <NavList>
        {sections.slice(0, 5).map((s, i) => (
          <NavItem key={s.id} icon={s.icon} active={i === 0}>
            {s.label}
          </NavItem>
        ))}
      </NavList>
    </nav>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div
      style={
        {
          '--text-secondary': '#a3a8ab',
          '--brand-bg': 'rgba(0, 144, 217, 0.16)',
          '--brand-dark': '#4cb8f0',
          '--disabled-text': '#5d6366',
          background: '#16191b',
          padding: 16,
          borderRadius: 16,
        } as React.CSSProperties
      }
    >
      <Sidebar />
    </div>
  ),
};

export const WithCounter: Story = {
  render: () => (
    <NavList>
      <NavItem icon={<Activity />} trailing="12">
        Alerts
      </NavItem>
    </NavList>
  ),
};
