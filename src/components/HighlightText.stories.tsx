import type { Meta, StoryObj } from '@storybook/react-vite';
import { HighlightText } from './HighlightText';

const meta: Meta<typeof HighlightText> = {
  title: 'Components/HighlightText',
  component: HighlightText,
};
export default meta;

type Story = StoryObj<typeof HighlightText>;

export const Match: Story = {
  args: { text: 'The quick brown fox jumps over the lazy dog', query: 'brown fox' },
};

export const NoQuery: Story = {
  args: { text: 'No highlight applied here', query: '' },
};

export const NoMatch: Story = {
  args: { text: 'Nothing here matches the query', query: 'xyz' },
};
