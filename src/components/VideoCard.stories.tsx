import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { VideoCard } from './VideoCard';

const svgUri = (bg: string, fg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="64"><rect width="96" height="64" fill="${bg}"/><circle cx="48" cy="26" r="12" fill="${fg}"/><rect x="24" y="42" width="48" height="22" rx="10" fill="${fg}"/></svg>`,
  )}`;

const PREVIEW = svgUri('#7a8b99', '#c9d3db');
const PHOTO = svgUri('#4b5560', '#9aa6b1');
const BROKEN = '/this-image-does-not-exist.jpg';

const base = {
  preview: PREVIEW,
  dateTime: 'Oct 04, 09:40PM',
  title: 'Wrong order of routine',
  description: 'Left side, Wrong direction of moving on attach (6) (stall 1-3,5-8)',
  worker: { name: 'Victor Ruiz Morales', photo: PHOTO },
};

const meta: Meta<typeof VideoCard> = {
  title: 'Components/VideoCard',
  component: VideoCard,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof VideoCard>;

function Bookmarker({ initial = false }: { initial?: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      aria-label="Favorite video"
      aria-pressed={on}
      onClick={(e) => {
        e.stopPropagation();
        setOn((v) => !v);
      }}
      style={{
        all: 'unset',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 12,
        cursor: 'pointer',
        color: on ? 'var(--brand-main)' : 'var(--text-tertiary)',
      }}
    >
      <Bookmark size={16} fill={on ? 'currentColor' : 'none'} />
    </button>
  );
}

export const Playground: Story = {
  args: { ...base, comment: 'Cow slipped near the gate', onClick: fn() },
};

export const New: Story = { args: { ...base, viewed: false } };

export const LastOpened: Story = { args: { ...base, viewed: true, current: true } };

export const Seen: Story = { args: { ...base, viewed: true } };

export const WithoutWorker: Story = {
  args: { ...base, worker: undefined, comment: 'No worker for this category' },
};

export const WorkerPhotoFailed: Story = {
  args: { ...base, worker: { name: 'Victor Ruiz Morales', photo: BROKEN } },
};

export const WithComment: Story = {
  args: { ...base, comment: 'Cow slipped near the gate' },
};

export const LongText: Story = {
  args: {
    ...base,
    title: 'Towel accidents',
    description:
      'Face and then cow (1) while the stall was being prepared and the attach order did not match the routine for the whole second row of the parlour.',
    comment:
      'A very long comment that must stay on one line and end with an ellipsis instead of making the row taller than its neighbours',
  },
};

export const WithSeverity: Story = {
  args: {
    ...base,
    meta: <span style={{ color: 'var(--danger-text)' }}>Severity: 3</span>,
  },
};

export const PreviewInaccessible: Story = {
  args: { ...base, preview: undefined, previewFallback: 'inaccessible' },
};

export const PreviewPlay: Story = {
  args: { ...base, preview: undefined, previewFallback: 'play', viewed: true },
};

export const PreviewArchived: Story = {
  args: { ...base, preview: undefined, previewFallback: 'archived' },
};

export const PreviewBrokenUrl: Story = {
  args: { ...base, preview: BROKEN, onPreviewError: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Inaccessible')).toBeVisible();
    await expect(args.onPreviewError).toHaveBeenCalledTimes(1);
  },
};

export const WithBookmark: Story = {
  args: { ...base, onClick: fn(), actions: <Bookmarker /> },
};

export const Bookmarked: Story = {
  args: { ...base, viewed: true, onClick: fn(), actions: <Bookmarker initial /> },
};

export const KeyboardActivation: Story = {
  args: { ...base, comment: 'Press Enter or Space', onClick: fn(), actions: <Bookmarker /> },
  play: async ({ canvasElement, args }) => {
    const row = within(canvasElement).getByRole('button', { name: /Video Press Enter/ });
    row.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Favorite video' }));
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const Mobile: Story = {
  args: { ...base, comment: 'Cow slipped near the gate', actions: <Bookmarker /> },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export const List: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: 10 }, (_, i) => (
        <VideoCard
          key={i}
          {...base}
          dateTime={`Oct 09, 12:${String(32 - i * 2).padStart(2, '0')}AM`}
          title="Towel accidents"
          description="Face and then cow (1)"
          worker={{ name: 'Worker-M82', photo: PHOTO }}
          viewed={i > 1}
          current={i === 2}
          onClick={() => {}}
          actions={<Bookmarker />}
        />
      ))}
    </div>
  ),
};

export const Skeleton: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <VideoCard.Skeleton />
      <VideoCard.Skeleton />
    </div>
  ),
};
