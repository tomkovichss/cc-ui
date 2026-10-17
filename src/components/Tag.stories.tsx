import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Mon 9/15' },
};

export const Pill: Story = {
  args: { variant: 'pill', children: 'Acme BPO' },
};

export const Accent: Story = {
  args: { variant: 'accent', children: '4h:30m current' },
};

export const Success: Story = {
  args: { variant: 'success', children: '2h:10m spent' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Needs attention' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'ASAP' },
};

export const Count: Story = {
  args: { variant: 'count', children: 3 },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <Tag variant="neutral">Mon 9/15</Tag>
      <Tag variant="pill">Acme BPO</Tag>
      <Tag variant="accent">4h:30m current</Tag>
      <Tag variant="success">2h:10m spent</Tag>
      <Tag variant="warning">Needs attention</Tag>
      <Tag variant="danger">ASAP</Tag>
      <Tag variant="count">3</Tag>
      <Tag variant="chip">Chip</Tag>
    </div>
  ),
};

const row = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } as const;
const pressableVariants = [
  'neutral',
  'pill',
  'accent',
  'success',
  'warning',
  'danger',
  'chip',
] as const;

export const Pressable: Story = {
  render: function Render() {
    const [on, setOn] = useState<Record<string, boolean>>({});
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pressableVariants.map((variant) => (
          <div key={variant} style={row}>
            <Tag variant={variant} onClick={() => {}}>
              {variant}
            </Tag>
            <Tag
              variant={variant}
              pressed={!!on[variant]}
              onClick={() => setOn((s) => ({ ...s, [variant]: !s[variant] }))}
            >
              {variant} (toggle)
            </Tag>
            <Tag variant={variant} pressed onClick={() => {}}>
              {variant} pressed
            </Tag>
          </div>
        ))}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={row}>
      {pressableVariants.map((variant) => (
        <Tag key={variant} variant={variant} disabled onClick={() => {}}>
          {variant}
        </Tag>
      ))}
      <Tag variant="chip" disabled pressed onClick={() => {}}>
        chip pressed
      </Tag>
      <Tag variant="pill" disabled pressed onClick={() => {}}>
        pill pressed
      </Tag>
    </div>
  ),
};

const dot = (color: string) => (
  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
);

export const WithLeadingDot: Story = {
  render: function Render() {
    const items = [
      { key: 'good', label: 'Good', color: 'var(--success-text)' },
      { key: 'fair', label: 'Fair', color: 'var(--warning-text)' },
      { key: 'poor', label: 'Poor', color: 'var(--danger-text)' },
    ];
    const [active, setActive] = useState<string[]>(['good', 'fair']);
    return (
      <div style={row}>
        {items.map((item) => (
          <Tag
            key={item.key}
            variant="chip"
            leading={dot(item.color)}
            pressed={active.includes(item.key)}
            aria-label={`Toggle ${item.label} events`}
            onClick={() =>
              setActive((a) =>
                a.includes(item.key) ? a.filter((k) => k !== item.key) : [...a, item.key],
              )
            }
          >
            {item.label}
          </Tag>
        ))}
      </div>
    );
  },
};

export const Removable: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(true);
    return (
      <div style={row}>
        {visible && (
          <Tag variant="accent" onRemove={() => setVisible(false)} removeLabel="Clear selected point">
            Selected point
          </Tag>
        )}
        <Tag variant="pill" onRemove={() => {}} removeLabel="Remove filter">
          Filter
        </Tag>
        <Tag
          variant="chip"
          pressed
          onClick={() => {}}
          onRemove={() => {}}
          removeLabel="Remove shift"
        >
          Pressable and removable
        </Tag>
        <Tag variant="pill" disabled onRemove={() => {}} removeLabel="Remove">
          Disabled
        </Tag>
      </div>
    );
  },
};

export const InsideForm: Story = {
  render: function Render() {
    const [submits, setSubmits] = useState(0);
    const [clicks, setClicks] = useState(0);
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmits((n) => n + 1);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <div style={row}>
          <Tag variant="chip" onClick={() => setClicks((n) => n + 1)}>
            Click me (must not submit)
          </Tag>
          <Tag variant="accent" onRemove={() => setClicks((n) => n + 1)} removeLabel="Remove">
            Remove me
          </Tag>
        </div>
        <div>Clicks: {clicks} · Form submits: {submits}</div>
      </form>
    );
  },
};
