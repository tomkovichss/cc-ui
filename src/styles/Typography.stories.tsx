import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './Typography.stories.module.css';

type Style = {
  name: string;
  classNames: string;
  useCase: string;
  sample: string;
};

const styleList: Style[] = [
  {
    name: 'base',
    classNames: 'text-base',
    useCase: 'Default for almost all text — body copy, labels, descriptions.',
    sample: 'The quick brown fox jumps over the lazy dog.',
  },
  {
    name: 'base bold',
    classNames: 'text-base text-bold',
    useCase: 'Links, buttons, and other interactive or emphasized inline text.',
    sample: 'View all shifts',
  },
  {
    name: 'base bold lg',
    classNames: 'text-base text-bold text-lg',
    useCase: 'Titles — section headers, dialog titles, card headings.',
    sample: 'Worker schedule',
  },
  {
    name: 'sm',
    classNames: 'text-base text-sm',
    useCase: 'Secondary/supporting text — helper text, captions, timestamps, metadata.',
    sample: 'Last updated 5 minutes ago',
  },
  {
    name: '2-line',
    classNames: 'text-base text-2-line',
    useCase: 'Multi-line text that needs a tighter line height, e.g. wrapped card descriptions.',
    sample: 'Notes about this worker span more than one line, so the tighter line height keeps it compact.',
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
