import type { Meta, StoryObj } from '@storybook/react-vite';

const rows = Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`);

const box: React.CSSProperties = {
  width: 240,
  height: 200,
  overflow: 'auto',
  padding: 12,
  borderRadius: 12,
  background: 'var(--card-surface)',
  boxShadow: 'inset 0 0 0 1px var(--border)',
};

function Demo() {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div>
        <p className="text-base text-medium">Custom (hover to reveal)</p>
        <div style={box}>
          {rows.map((r) => (
            <div key={r} className="text-base">{r}</div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-base text-medium">.scrollbar-default</p>
        <div style={box} className="scrollbar-default">
          {rows.map((r) => (
            <div key={r} className="text-base">{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

const meta = { title: 'Foundations/Scrollbars', component: Demo } satisfies Meta<typeof Demo>;
export default meta;
export const Default: StoryObj<typeof meta> = {};
