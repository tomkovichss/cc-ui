import { useState, type ComponentProps, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { Printer, Settings } from 'lucide-react';
import { ToolbarAdaptive } from './ToolbarAdaptive';
import { Button } from './Button';
import { Tabs } from './Tabs';

const meta: Meta<typeof ToolbarAdaptive> = {
  title: 'Components/ToolbarAdaptive',
  component: ToolbarAdaptive,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    left: { control: false },
    right: { control: false },
    children: { control: false },
    scrollRoot: { control: false },
    onStateChange: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof ToolbarAdaptive>;

const views = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
];

function useWorkersControls() {
  const [view, setView] = useState('grid');
  return {
    left: (
      <>
        <Button variant="tertiary" size="sm">
          Oct 1 – Oct 19
        </Button>
        <Button variant="tertiary" size="sm">
          Metrics Calculation
        </Button>
      </>
    ),
    right: (
      <>
        <Tabs items={views} value={view} onChange={setView} variant="box" />
        <Button variant="tertiary" size="sm" leadingIcon={<Printer />}>
          Print
        </Button>
        <Button variant="tertiary" size="sm" leadingIcon={<Settings />}>
          Settings
        </Button>
      </>
    ),
  };
}

/** Tall filler so the page can scroll under the bar. */
function Filler({ height = 2000 }: { height?: number }) {
  return (
    <div style={{ height, padding: 24, color: 'var(--text-secondary)' }}>
      Scroll down: after 16px the bar becomes a floating pill, and back at the top.
    </div>
  );
}

function Page({ children }: { children: ReactNode }) {
  return <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>{children}</div>;
}

function WorkersBar({
  pending,
  ...props
}: { pending?: boolean } & Omit<ComponentProps<typeof ToolbarAdaptive>, 'left' | 'right'>) {
  const { left, right } = useWorkersControls();
  const hide = (node: ReactNode) =>
    pending ? <div style={{ visibility: 'hidden', display: 'flex', gap: 8 }}>{node}</div> : node;
  return <ToolbarAdaptive left={hide(left)} right={hide(right)} {...props} />;
}

export const Playground: Story = {
  args: { threshold: 16 },
  render: (args) => (
    <Page>
      <WorkersBar {...args} />
      <Filler />
    </Page>
  ),
};

/** Primary reference: window scroll. The play function scrolls past the threshold and back. */
export const ScrollMorph: Story = {
  render: () => (
    <Page>
      <WorkersBar />
      <Filler />
    </Page>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByTestId('header').firstElementChild as HTMLElement;
    await expect(card.dataset.state).toBe('top');
    window.scrollTo(0, 300);
    await waitFor(() => expect(card.dataset.state).toBe('floating'));
    window.scrollTo(0, 0);
    await waitFor(() => expect(card.dataset.state).toBe('top'));
  },
};

export const LeftOnly: Story = {
  render: () => (
    <Page>
      <ToolbarAdaptive left={<Button variant="tertiary" size="sm">Oct 1 – Oct 19</Button>} />
      <Filler />
    </Page>
  ),
};

export const RightOnly: Story = {
  render: () => (
    <Page>
      <ToolbarAdaptive
        right={
          <Button variant="tertiary" size="sm" leadingIcon={<Settings />}>
            Settings
          </Button>
        }
      />
      <Filler />
    </Page>
  ),
};

/** `children` replaces `left` / `right`; `className` lands on the card (stacked rows here). */
export const CustomLayout: Story = {
  render: () => (
    <Page>
      <ToolbarAdaptive>
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          <Button variant="tertiary" size="sm">Row one</Button>
          <Button variant="tertiary" size="sm">Row two</Button>
        </div>
      </ToolbarAdaptive>
      <Filler />
    </Page>
  ),
};

/** The `.page-scroller` case: the bar watches its nearest scrollable ancestor, not the window. */
export const InnerScrollContainer: Story = {
  render: () => (
    <div style={{ height: '100vh', padding: 24, boxSizing: 'border-box', background: 'var(--bg)' }}>
      <div
        data-testid="scroller"
        style={{
          height: '100%',
          overflowY: 'auto',
          background: 'var(--surface-sunken)',
          borderRadius: 16,
        }}
      >
        <WorkersBar />
        <Filler />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByTestId('header').firstElementChild as HTMLElement;
    const scroller = canvas.getByTestId('scroller');
    scroller.scrollTop = 300;
    await waitFor(() => expect(card.dataset.state).toBe('floating'));
    scroller.scrollTop = 0;
    await waitFor(() => expect(card.dataset.state).toBe('top'));
  },
};

/** The consumer hides controls with `invisible` while data loads; the bar keeps its size. */
export const ControlsPending: Story = {
  render: () => (
    <Page>
      <WorkersBar pending />
      <Filler />
    </Page>
  ),
};
