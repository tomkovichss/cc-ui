import type { Meta, StoryObj } from '@storybook/react-vite';
import { UiElementsSidebar } from './UiElementsSidebar';

const meta: Meta<typeof UiElementsSidebar> = {
  title: 'Components/UiElementsSidebar',
  component: UiElementsSidebar,
};
export default meta;

type Story = StoryObj<typeof UiElementsSidebar>;

export const Default: Story = {
  args: {
    sections: [
      { id: 'buttons', label: 'Buttons', count: 6 },
      { id: 'inputs', label: 'Inputs', count: 4 },
      { id: 'cards', label: 'Cards', count: 3 },
    ],
  },
};
