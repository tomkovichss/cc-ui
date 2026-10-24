import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check, ChevronRight } from 'lucide-react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'brand', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['base', 'sm', 'xs'] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

const variants = ['neutral', 'brand', 'success', 'warning', 'danger'] as const;
const sizes = ['base', 'sm', 'xs'] as const;
const row = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' } as const;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          {variants.map((variant) => (
            <Badge key={variant} variant={variant} size={size}>
              {variant}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithDot: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          {variants.map((variant) => (
            <Badge key={variant} variant={variant} size={size} dot>
              {variant}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sizes.map((size) => (
        <div key={size} style={row}>
          <Badge variant="success" size={size} iconLeft={<Check />}>
            Good
          </Badge>
          <Badge variant="brand" size={size} iconRight={<ChevronRight />}>
            Details
          </Badge>
          <Badge variant="warning" size={size} iconLeft={<Check />} iconRight={<ChevronRight />}>
            Both
          </Badge>
        </div>
      ))}
    </div>
  ),
};
