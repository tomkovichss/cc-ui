import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart3,
  Clock,
  FileChartLine,
  Film,
  MoreVertical,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from './Button';
import { Dropdown } from './Dropdown';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { NavItem, NavList } from './NavItem';
import { Logo } from './Logo';
import { LanguageSwitch, Sidebar, SidebarFooter } from './Sidebar';
import { Tabs } from './Tabs';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ width: 280, height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Sidebar>;

const farms = [
  { value: 'sunny', label: 'Sunny Valley Farm' },
  { value: 'green', label: 'Green Hills Dairy' },
];
const longFarms = [{ value: 'long', label: 'The Very Long Named Family Dairy Farm of Wisconsin' }];
const barns = [
  { value: 'milk', label: 'Milk Barn' },
  { value: 'calf', label: 'Calf Barn' },
];
const barnsWithFeed = [...barns, { value: 'feed', label: 'Feed Center' }];
const languages = [
  { value: 'en', label: 'English', lang: 'en' },
  { value: 'es', label: 'Español', lang: 'es' },
];

interface NavEntry {
  id: string;
  label: string;
  icon: ReactNode;
}
const milkItems: NavEntry[] = [
  { id: 'workers', label: 'Milk Barn Workers', icon: <Users size={20} /> },
  { id: 'videos', label: 'Milk Barn Videos', icon: <Film size={20} /> },
  { id: 'efficiency', label: 'Efficiency', icon: <FileChartLine size={20} /> },
  { id: 'routines', label: 'Routines Quality', icon: <BarChart3 size={20} /> },
  { id: 'general', label: 'General performance', icon: <TrendingUp size={20} /> },
];
const calfItems: NavEntry[] = [
  { id: 'calf-workers', label: 'Calf Barn Workers', icon: <Users size={20} /> },
  { id: 'calf-videos', label: 'Calf Barn Videos', icon: <Film size={20} /> },
  { id: 'calf-prep', label: 'Prep Lag Time', icon: <Clock size={20} /> },
];

function MoreMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <Button
        variant="tertiary"
        aria-label="More"
        aria-haspopup="menu"
        aria-expanded={open}
        leadingIcon={<MoreVertical size={24} />}
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div style={{ position: 'absolute', bottom: '100%', right: 0, zIndex: 10 }}>
          <Menu>
            <MenuItem onClick={() => setOpen(false)}>Settings</MenuItem>
            <MenuItem onClick={() => setOpen(false)}>Sign out</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}

interface DemoProps {
  items?: NavEntry[];
  withSwitcher?: boolean;
  farmOptions?: typeof farms;
  email?: string;
  initialLang?: string;
  initialBarn?: string;
  /** Line tabs flush under the header instead of box tabs. */
  lineSwitcher?: boolean;
}

function Demo({
  items,
  withSwitcher = true,
  farmOptions = farms,
  email = 'farmermail@gmail.com',
  initialLang = 'en',
  initialBarn = 'milk',
  lineSwitcher = false,
}: DemoProps) {
  const [farm, setFarm] = useState(farmOptions[0].value);
  const [barn, setBarn] = useState(initialBarn);
  const [lang, setLang] = useState(initialLang);
  const list = items ?? (barn === 'calf' ? calfItems : milkItems);
  const [current, setCurrent] = useState<string | null>(null);
  const activeId = list.some((i) => i.id === current) ? current : list[0].id;

  return (
    <Sidebar
      aria-label="Main navigation"
      switcherLayout={lineSwitcher ? 'flush' : 'inset'}
      header={
        <>
          <Logo size={lineSwitcher ? 32 : 40} />
          <Dropdown
            variant="field"
            size="base"
            options={farmOptions}
            value={farm}
            onChange={setFarm}
            aria-label="Farm"
          />
        </>
      }
      switcher={
        withSwitcher ? (
          lineSwitcher ? (
            <Tabs
              variant="line"
              size="sm"
              items={barnsWithFeed}
              value={barn}
              onChange={setBarn}
              aria-label="Barn"
            />
          ) : (
            <Tabs variant="box" size="sm" items={barns} value={barn} onChange={setBarn} aria-label="Barn" />
          )
        ) : undefined
      }
      footer={
        <SidebarFooter
          title={email}
          subtitle={
            <LanguageSwitch items={languages} value={lang} onChange={setLang} aria-label="Language" />
          }
          action={<MoreMenu />}
        />
      }
    >
      <NavList>
        {list.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            active={item.id === activeId}
            onClick={() => setCurrent(item.id)}
          >
            {item.label}
          </NavItem>
        ))}
      </NavList>
    </Sidebar>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const CalfBarn: Story = { render: () => <Demo initialBarn="calf" /> };

export const LineSwitcher: Story = { render: () => <Demo lineSwitcher /> };

export const NoSwitcher: Story = { render: () => <Demo withSwitcher={false} /> };

export const LongContent: Story = {
  render: () => (
    <Demo
      farmOptions={longFarms}
      email="a.very.long.email.address.of.the.farm.owner@example-dairy-company.com"
      items={[
        { id: 'a', label: 'A very long section name that does not fit', icon: <Users size={20} /> },
        { id: 'b', label: 'Another extremely long navigation label', icon: <Film size={20} /> },
      ]}
    />
  ),
};

export const ManyItems: Story = {
  render: () => (
    <Demo
      items={Array.from({ length: 20 }, (_, i) => ({
        id: `item-${i}`,
        label: `Report section ${i + 1}`,
        icon: <FileChartLine size={20} />,
      }))}
    />
  ),
};

export const Spanish: Story = { render: () => <Demo initialLang="es" /> };

export const Interactive: Story = { render: () => <Demo /> };
