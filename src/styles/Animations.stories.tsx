import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './Animations.stories.module.css';

const cardCode = `box-shadow:
  inset 0 0 0 1px #efefef,
  0 1px 2px #1018200a,
  0 0 0 0 var(--brand-main);
transition: box-shadow 0.2s, transform 0.2s;

:hover {
  box-shadow:
    inset 0 0 0 1px #efefef,
    0 1px 2px #1018200a,
    0 0 0 2px var(--brand-main);
  transform: scale(1.01);
}
:active {
  transform: scale(0.99);
}`;

function CardAnimation() {
  return (
    <div className={styles.list}>
      <div className={styles.item}>
        <div className={styles.preview}>
          <div className={styles.example}>Hover & press me</div>
        </div>
        <div>
          <div className={styles.name}>Card</div>
          <div className={styles.description}>
            Interactive cards carry a third, invisible shadow in brand-main with 0px spread next to
            the usual inset border and soft drop shadow. On hover that shadow grows to 2px, which
            reads as an accent ring, and the card scales up to 1.01. While pressed it scales down to
            0.99. Because the shadow layers match one-to-one, the browser interpolates them smoothly.
          </div>
          <div className={styles.code}>{cardCode}</div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: 'Foundations/Animations',
};
export default meta;

type Story = StoryObj;

export const Cards: Story = {
  render: () => <CardAnimation />,
};
