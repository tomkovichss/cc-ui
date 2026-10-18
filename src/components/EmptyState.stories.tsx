import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCheck, FileSearchCorner, TriangleAlert, WifiOff } from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Success: Story = {
  args: {
    tone: 'success',
    icon: <CheckCheck size={24} />,
    title: 'Nice Job',
    children: (
      <>
        No issues found for <strong>Missed postdip</strong> between <strong>Oct 04</strong>, and{' '}
        <strong>Oct 10,</strong> and no issues in this category in the last 30 days. Awesome!
      </>
    ),
  },
};

export const Neutral: Story = {
  args: {
    icon: <FileSearchCorner size={24} />,
    title: 'No issues found',
    children: (
      <>
        <p>No issues found for Down cows between Oct 04, and Oct 10.</p>
        <p>Below you can check videos from the same category in the last 30 days.</p>
      </>
    ),
  },
};

export const WithAction: Story = {
  args: {
    icon: <FileSearchCorner size={24} />,
    title: 'Nothing found',
    children: 'Try changing the filters or the date range.',
    action: <Button variant="secondary">Reset filters</Button>,
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    icon: <TriangleAlert size={24} />,
    title: 'Data is incomplete',
    children: 'Some cameras have not reported since Oct 10, so the list may be missing items.',
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    icon: <WifiOff size={24} />,
    title: "Couldn't load the list",
    children: 'Check your connection and try again.',
    action: <Button>Retry</Button>,
  },
};
