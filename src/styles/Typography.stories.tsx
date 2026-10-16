import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './Typography.stories.module.css';

type Style = {
  name: string;
  classNames: string;
  useCase: string;
  sample: string;
};

// Names follow `.text-{size} [.medium] [.2-line]` and match the text styles in Figma 1:1.
const multiLine = 'Notes about this worker span more than one line, so the tighter line height keeps it compact.';

const styleList: Style[] = [
  {
    name: '.text-sm',
    classNames: 'text-base text-sm',
    useCase: 'Secondary/supporting text — helper text, captions, timestamps, metadata.',
    sample: 'Last updated 5 minutes ago',
  },
  {
    name: '.text-sm .medium',
    classNames: 'text-base text-medium text-sm',
    useCase: 'Emphasized small text — badges, tags, small labels.',
    sample: 'Pending review',
  },
  {
    name: '.text-sm .2-line',
    classNames: 'text-base text-sm text-2-line',
    useCase: 'Wrapped small text with a tighter line height, e.g. multi-line captions.',
    sample: multiLine,
  },
  {
    name: '.text-sm .medium .2-line',
    classNames: 'text-base text-medium text-sm text-2-line',
    useCase: 'Wrapped emphasized small text with a tighter line height.',
    sample: multiLine,
  },
  {
    name: '.text-base',
    classNames: 'text-base',
    useCase: 'Default for almost all text — body copy, labels, descriptions.',
    sample: 'The quick brown fox jumps over the lazy dog.',
  },
  {
    name: '.text-base .medium',
    classNames: 'text-base text-medium',
    useCase: 'Links, buttons, and other interactive or emphasized inline text.',
    sample: 'View all shifts',
  },
  {
    name: '.text-base .2-line',
    classNames: 'text-base text-2-line',
    useCase: 'Multi-line text that needs a tighter line height, e.g. wrapped card descriptions.',
    sample: multiLine,
  },
  {
    name: '.text-base .medium .2-line',
    classNames: 'text-base text-medium text-2-line',
    useCase: 'Wrapped emphasized text with a tighter line height, e.g. two-line button or link labels.',
    sample: multiLine,
  },
  {
    name: '.text-lg',
    classNames: 'text-base text-lg',
    useCase: 'Larger regular text — lead paragraphs, prominent values.',
    sample: 'Worker schedule',
  },
  {
    name: '.text-lg .medium',
    classNames: 'text-base text-medium text-lg',
    useCase: 'Titles — section headers, dialog titles, card headings.',
    sample: 'Worker schedule',
  },
  {
    name: '.text-lg .2-line',
    classNames: 'text-base text-lg text-2-line',
    useCase: 'Wrapped large text with a tighter line height.',
    sample: multiLine,
  },
  {
    name: '.text-lg .medium .2-line',
    classNames: 'text-base text-medium text-lg text-2-line',
    useCase: 'Wrapped titles with a tighter line height, e.g. long dialog or card headings.',
    sample: multiLine,
  },
];

function TypographyStyles() {
  return (
    <div className={styles.list}>
      {styleList.map((style) => (
        <div key={style.name} className={styles.row}>
          <div className={styles.meta}>
            <div className={styles.name}>{style.name}</div>
            <div className={styles.useCase}>{style.useCase}</div>
            <div className={styles.code}>{style.classNames}</div>
          </div>
          <div className={styles.preview}>
            <div className={style.classNames}>{style.sample}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Typography',
};
export default meta;

type Story = StoryObj;

export const Styles: Story = {
  render: () => <TypographyStyles />,
};
