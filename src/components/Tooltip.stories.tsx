import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreVertical } from 'lucide-react';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 80 }}>
      <Tooltip content="User menu">
        <Button variant="tertiary" leadingIcon={<MoreVertical />} aria-label="User menu" />
      </Tooltip>
    </div>
  ),
};

/** Near the viewport bottom or an `overflow: hidden` ancestor, the tooltip flips above and is never clipped. */
export const NearEdges: Story = {
  render: () => (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 8,
        overflow: 'hidden',
      }}
    >
      <Button variant="tertiary" leadingIcon={<MoreVertical />} aria-label="Bottom left" />
      <Button variant="tertiary" leadingIcon={<MoreVertical />} aria-label="Bottom right edge tooltip" />
    </div>
  ),
};
