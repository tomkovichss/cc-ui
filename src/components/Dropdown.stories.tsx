import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { MapPin, Tractor, Milk } from 'lucide-react';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

const paddocks = [
  { value: 'north', label: 'North paddock' },
  { value: 'south', label: 'South paddock' },
  { value: 'east', label: 'East paddock' },
  { value: 'west', label: 'West paddock', disabled: true },
];

function ControlledDemo() {
  const [value, setValue] = useState<string | undefined>('south');
  return (
    <Dropdown
      label="Paddock"
      options={paddocks}
      value={value}
      onChange={setValue}
      placeholder="Select a paddock…"
    />
  );
}

export const Default: Story = {
  render: () => <ControlledDemo />,
};

export const Placeholder: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return <Dropdown label="Paddock" options={paddocks} value={value} onChange={setValue} />;
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('cow');
    return (
      <Dropdown
        label="Animal type"
        value={value}
        onChange={setValue}
        options={[
          { value: 'cow', label: 'Dairy cow', icon: <Milk /> },
          { value: 'calf', label: 'Calf', icon: <Tractor /> },
          { value: 'pasture', label: 'Pasture', icon: <MapPin /> },
        ]}
      />
    );
  },
};

export const WithHelperText: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Dropdown
        label="Herd"
        options={paddocks}
        value={value}
        onChange={setValue}
        helperText="Choose which herd this task applies to."
      />
    );
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <Dropdown
        label="Herd"
        options={paddocks}
        value={value}
        onChange={setValue}
        error="A herd must be selected."
      />
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('north');
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: 280,
        }}
      >
        <Dropdown size="sm" options={paddocks} value={value} onChange={setValue} />
        <Dropdown size="base" options={paddocks} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    label: 'Paddock',
    options: paddocks,
    placeholder: 'Select a paddock…',
    disabled: true,
  },
};

const farms = [
  'Dairy No 001 A',
  'Dairy No 002 B',
  'Dairy No 003 D',
  'Green Valley',
  'Hillside',
  'North Pasture',
  'Oak Ridge',
  'River Bend',
  'Riverside East',
  'Sunny Acres',
  'West Meadow',
].map((name) => ({ value: name, label: name }));

function SearchableDemo() {
  const [value, setValue] = useState<string | undefined>('Dairy No 003 D');
  return <Dropdown aria-label="Farm" searchable options={farms} value={value} onChange={setValue} />;
}

export const Searchable: Story = {
  render: () => <SearchableDemo />,
};

function DefaultOpenDemo() {
  const [value, setValue] = useState<string | undefined>();
  return (
    <Dropdown label="Paddock" options={paddocks} value={value} onChange={setValue} defaultOpen autoFocus />
  );
}

export const DefaultOpen: Story = {
  render: () => <DefaultOpenDemo />,
};

function VariantDemo(props: Partial<Extract<React.ComponentProps<typeof Dropdown>, { multiple?: false }>>) {
  const [value, setValue] = useState<string | undefined>('south');
  return <Dropdown options={paddocks} value={value} onChange={setValue} {...props} />;
}

export const SecondaryButton: Story = {
  render: () => <VariantDemo variant="secondary" />,
};

export const TertiaryButton: Story = {
  render: () => <VariantDemo variant="tertiary" />,
};

export const Pill: Story = {
  render: () => <VariantDemo variant="pill" />,
};

export const ButtonSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <VariantDemo variant="secondary" size="sm" />
      <VariantDemo variant="secondary" size="base" />
      <VariantDemo variant="tertiary" size="sm" />
      <VariantDemo variant="tertiary" size="base" />
    </div>
  ),
};

export const FixedTriggerLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <VariantDemo variant="secondary" triggerLabel="Actions" />
      <VariantDemo variant="pill" triggerLabel="Herd" />
    </div>
  ),
};

export const MenuAlignEnd: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: 360,
        paddingBottom: 220,
      }}
    >
      <VariantDemo variant="secondary" menuAlign="end" triggerLabel="Actions" />
    </div>
  ),
};

function ButtonWithIconsDemo() {
  const [value, setValue] = useState<string | undefined>('cow');
  return (
    <Dropdown
      variant="secondary"
      value={value}
      onChange={setValue}
      options={[
        { value: 'cow', label: 'Dairy cow', icon: <Milk /> },
        { value: 'calf', label: 'Calf', icon: <Tractor /> },
        { value: 'pasture', label: 'Pasture', icon: <MapPin /> },
      ]}
    />
  );
}

export const ButtonWithIcons: Story = {
  render: () => <ButtonWithIconsDemo />,
};

const shifts = [
  { value: '001__day', label: '001 Day shift' },
  { value: '001__night', label: '001 Night shift' },
  { value: '002__day', label: '002 Day shift' },
  { value: '002__night', label: '002 Night shift' },
  { value: '003__day', label: '003 Day shift' },
  { value: '003__night', label: '003 Night shift' },
];

type MultipleProps = Omit<
  Extract<React.ComponentProps<typeof Dropdown>, { multiple: true }>,
  'multiple' | 'value' | 'onChange' | 'options'
> & { initial?: string[]; options?: typeof shifts };

function MultipleDemo({ initial = ['002__day', '001__night'], options = shifts, ...rest }: MultipleProps) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <div style={{ minHeight: 320 }}>
      <Dropdown multiple options={options} value={value} onChange={setValue} {...rest} />
    </div>
  );
}

export const Multiple: Story = {
  render: () => <MultipleDemo label="Compare with" />,
};

export const MultipleSecondary: Story = {
  render: () => <MultipleDemo variant="secondary" aria-label="Shifts" />,
};

export const MultiplePill: Story = {
  render: () => (
    <MultipleDemo
      variant="pill"
      triggerPrefix="Compare with:"
      aria-label="Compare with"
      renderTriggerLabel={(sel) =>
        sel.length === 1 ? sel[0].label : `${sel[0].label} and ${sel.length - 1} more`
      }
    />
  ),
};

export const MultipleWithSearch: Story = {
  render: () => <MultipleDemo searchable aria-label="Shifts" />,
};

export const MultipleWithPrefix: Story = {
  render: () => <MultipleDemo variant="secondary" triggerPrefix="Compare with:" aria-label="Compare with" />,
};

export const MultipleEmpty: Story = {
  render: () => <MultipleDemo initial={[]} label="Compare with" placeholder="-" />,
};

export const MultipleManySelected: Story = {
  render: () => (
    <MultipleDemo
      initial={['002__day', '001__day', '003__night', '001__night']}
      variant="secondary"
      triggerPrefix="Compare with:"
      aria-label="Compare with"
    />
  ),
};

export const MultipleWithDisabledOptions: Story = {
  render: () => (
    <MultipleDemo
      label="Compare with"
      options={shifts.map((opt, i) => ({ ...opt, disabled: i % 3 === 1 }))}
    />
  ),
};

export const MultipleSpanish: Story = {
  render: () => (
    <MultipleDemo
      variant="secondary"
      triggerPrefix="Comparar con:"
      aria-label="Comparar con"
      moreText={(n: number) => `y ${n} más`}
    />
  ),
};

function MultipleOpenUpwardDemo() {
  const [value, setValue] = useState<string[]>(['002__day']);
  return (
    <div style={{ height: 'calc(100vh - 48px)', display: 'flex', alignItems: 'flex-end' }}>
      <Dropdown
        multiple
        variant="secondary"
        aria-label="Shifts"
        options={shifts}
        value={value}
        onChange={setValue}
        defaultOpen
      />
    </div>
  );
}

export const MultipleOpenUpward: Story = {
  render: () => <MultipleOpenUpwardDemo />,
};
