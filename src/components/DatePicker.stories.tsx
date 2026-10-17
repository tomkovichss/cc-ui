import { useEffect, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    formatValue: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

type PickerProps = Omit<ComponentProps<typeof DatePicker>, 'value' | 'onChange'>;

/** Holds the date so each story behaves like a real controlled picker. */
function Controlled({ initial = null, ...props }: PickerProps & { initial?: Date | null }) {
  const [value, setValue] = useState<Date | null>(initial);
  return <DatePicker {...props} value={value} onChange={setValue} />;
}

const frame = { minHeight: 380, width: 220 } as const;

export const Default: Story = {
  render: (args) => (
    <div style={frame}>
      <Controlled {...args} label="From" placeholder="Pick a date" />
    </div>
  ),
};

export const WithValue: Story = {
  render: (args) => (
    <div style={frame}>
      <Controlled {...args} label="From" initial={new Date(2026, 9, 3)} />
    </div>
  ),
};

export const WithMinMax: Story = {
  render: (args) => (
    <div style={frame}>
      <Controlled
        {...args}
        label="Calving date"
        helperText="Oct 08 – Nov 12 only"
        initial={new Date(2026, 9, 15)}
        minDate={new Date(2026, 9, 8)}
        maxDate={new Date(2026, 10, 12)}
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={frame}>
      <Controlled {...args} label="From" initial={new Date(2026, 9, 3)} disabled />
    </div>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <div style={frame}>
      <Controlled {...args} label="From" error="Pick a date" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ ...frame, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Controlled {...args} label="Small" size="sm" initial={new Date(2026, 9, 3)} />
      <Controlled {...args} label="Base" size="base" initial={new Date(2026, 9, 3)} />
    </div>
  ),
};

export const PlacementEnd: Story = {
  name: 'Placement end',
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16, minHeight: 420 }}>
      <div style={{ width: 160 }}>
        <Controlled {...args} label="To" placement="bottom-end" initial={new Date(2026, 9, 3)} />
      </div>
    </div>
  ),
};

const darkTokens: Record<string, string> = {
  '--text-primary': '#f2f4f5',
  '--text-secondary': '#b4bbc0',
  '--text-tertiary': '#97a0a6',
  '--bg': '#0f1214',
  '--card-surface': '#1a1e21',
  '--surface-muted': '#2a2f33',
  '--border': '#2f353a',
  '--border-input': '#3a4146',
  '--disabled-bg': '#2a2f33',
  '--disabled-text': '#6b7378',
  '--brand-bg': '#0b3347',
};

/** The popup is portalled to <body>, so the dark tokens go on the root element, like an app theme would. */
function DarkTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const previous = Object.keys(darkTokens).map((name) => [name, root.style.getPropertyValue(name)] as const);
    Object.entries(darkTokens).forEach(([name, val]) => root.style.setProperty(name, val));
    return () => previous.forEach(([name, val]) => (val ? root.style.setProperty(name, val) : root.style.removeProperty(name)));
  }, []);
  return (
    <div style={{ minHeight: 420, padding: 16, background: 'var(--bg)' }}>
      <div style={{ width: 220 }}>
      <Controlled label="From" initial={new Date(2026, 9, 3)} />
      </div>
    </div>
  );
}

export const DarkThemed: Story = {
  name: 'Dark theme',
  parameters: { layout: 'fullscreen' },
  render: () => <DarkTheme />,
};

export const Spanish: Story = {
  render: (args) => (
    <div style={frame}>
      <Controlled
        {...args}
        label="Desde"
        placeholder="Elegir fecha"
        openLabel="Abrir calendario"
        dialogLabel="Elegir fecha"
        locale="es"
        weekStartsOn={1}
        initial={new Date(2026, 9, 3)}
      />
    </div>
  ),
};

function RangePairDemo() {
  const [from, setFrom] = useState<Date | null>(new Date(2026, 9, 3));
  const [to, setTo] = useState<Date | null>(null);
  return (
    <div style={{ display: 'flex', gap: 12, minHeight: 380 }}>
      <div style={{ width: 160 }}>
        <DatePicker
          label="From"
          value={from}
          onChange={(d) => {
            setFrom(d);
            // Keep the pair valid when the start moves past the end.
            if (d && to && to < d) setTo(null);
          }}
          maxDate={to ?? undefined}
        />
      </div>
      <div style={{ width: 160 }}>
        <DatePicker label="To" placeholder="Pick a date" value={to} onChange={setTo} minDate={from ?? undefined} placement="bottom-end" />
      </div>
    </div>
  );
}

export const RangePair: Story = {
  name: 'Range pair',
  render: () => <RangePairDemo />,
};

export const NarrowViewport: Story = {
  name: 'Narrow viewport (360px)',
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16, minHeight: 420 }}>
      <div style={{ width: 140 }}>
        <Controlled {...args} label="To" placement="bottom-end" initial={new Date(2026, 9, 3)} />
      </div>
    </div>
  ),
};
