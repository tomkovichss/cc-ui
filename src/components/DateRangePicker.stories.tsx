import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateRangePicker, type DateRange, type DateRangePreset } from './DateRangePicker';
import { addDays, startOfDay } from '../utils/date';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component: [
          'One field for a period (`Oct 24 – Oct 31`) that opens a popup with presets and a two-month calendar.',
          'Pick a start, hover to preview, pick an end; an earlier second click becomes the new start.',
          '`onChange` fires only with a complete range: on **Apply**, or at once when a preset is clicked.',
          'Esc or a click outside cancels. Under 480px the popup is a bottom sheet and presets become chips.',
          '',
          '| Prop | Type | Notes |',
          '| --- | --- | --- |',
          '| `value` | `{ start: Date \\| null; end: Date \\| null }` | local-midnight Dates |',
          '| `onChange` | `(range: { start: Date; end: Date }) => void` | complete ranges only |',
          '| `minDate` / `maxDate` | `Date` | days outside are disabled |',
          '| `presets` | `{ id, label, range: () => {start, end} }[]` | listed beside the calendar |',
          '| `activePresetId` | `string \\| null` | highlights a preset and shows its label in the field; `null` = custom |',
          '| `loading` | `boolean` | skeleton text, field disabled |',
          '| `size` | `\'sm\' \\| \'base\'` | 36px / 44px |',
          '| `locale`, `weekStartsOn`, `formatValue`, `placement` | | same as `DatePicker` |',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    value: { control: false },
    onChange: { control: false },
    minDate: { control: false },
    maxDate: { control: false },
    presets: { control: false },
    formatValue: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof DateRangePicker>;
type PickerProps = Omit<ComponentProps<typeof DateRangePicker>, 'value' | 'onChange'>;

const today = () => startOfDay(new Date());
const lastDays = (n: number) => () => ({ start: addDays(today(), -(n - 1)), end: today() });

const presets: DateRangePreset[] = [
  { id: '3d', label: 'Last 3 days', range: lastDays(3) },
  { id: '7d', label: 'Last week', range: lastDays(7) },
  { id: '30d', label: 'Last month', range: lastDays(30) },
];

/** Holds the range so each story behaves like a real controlled picker. */
function Controlled({
  initial = { start: null, end: null },
  width = 280,
  ...props
}: PickerProps & { initial?: DateRange; width?: number | string }) {
  const [value, setValue] = useState<DateRange>(initial);
  const [activePresetId, setActive] = useState<string | null | undefined>(props.activePresetId);
  return (
    <div style={{ minHeight: 420, width }}>
      <DateRangePicker
        {...props}
        value={value}
        activePresetId={props.presets ? activePresetId : undefined}
        onChange={(range) => {
          setValue(range);
          // A range is "active" when it equals a preset's range.
          const match = props.presets?.find((p) => {
            const r = p.range();
            return r.start.getTime() === range.start.getTime() && r.end.getTime() === range.end.getTime();
          });
          setActive(props.presets ? (match?.id ?? null) : undefined);
        }}
      />
    </div>
  );
}

const week = () => ({ start: addDays(today(), -6), end: today() });

export const Default: Story = {
  render: (args) => <Controlled {...args} label="Period" />,
};

export const WithPresets: Story = {
  render: (args) => <Controlled {...args} label="Period" presets={presets} initial={week()} />,
};

export const PresetActive: Story = {
  render: (args) => (
    <Controlled {...args} label="Period" presets={presets} activePresetId="7d" initial={week()} />
  ),
};

export const MinMax: Story = {
  render: (args) => (
    <Controlled
      {...args}
      label="Period"
      helperText="Up to today, within the last 90 days"
      presets={presets}
      initial={week()}
      minDate={addDays(today(), -90)}
      maxDate={today()}
    />
  ),
};

export const SameDay: Story = {
  render: (args) => <Controlled {...args} label="Period" initial={{ start: today(), end: today() }} />,
};

export const CrossYear: Story = {
  render: (args) => (
    <Controlled
      {...args}
      label="Period"
      width={320}
      initial={{ start: new Date(today().getFullYear() - 1, 9, 24), end: new Date(today().getFullYear(), 0, 3) }}
    />
  ),
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} label="Period" disabled initial={week()} />,
};

export const Loading: Story = {
  render: (args) => <Controlled {...args} label="Period" loading initial={week()} />,
};

export const Error: Story = {
  render: (args) => <Controlled {...args} label="Period" error="Pick a period" />,
};

export const SizeSm: Story = {
  render: (args) => <Controlled {...args} size="sm" presets={presets} initial={week()} />,
};

/** The field fills its parent and never grows with its text: it truncates instead. */
export const Narrow: Story = {
  render: (args) => (
    <Controlled
      {...args}
      width={160}
      size="sm"
      initial={{ start: new Date(today().getFullYear() - 1, 9, 24), end: today() }}
    />
  ),
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: (args) => <Controlled {...args} width="100%" label="Period" presets={presets} initial={week()} />,
};

export const Spanish: Story = {
  render: (args) => (
    <Controlled
      {...args}
      label="Período"
      locale="es"
      weekStartsOn={1}
      placeholder="Elegir período"
      applyLabel="Aplicar"
      cancelLabel="Cancelar"
      presets={[
        { id: '3d', label: 'Últimos 3 días', range: lastDays(3) },
        { id: '7d', label: 'Última semana', range: lastDays(7) },
        { id: '30d', label: 'Último mes', range: lastDays(30) },
      ]}
      initial={week()}
    />
  ),
};
