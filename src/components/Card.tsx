import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  /** Shows a second sheet behind the card, for representing a stack/batch. */
  stacked?: boolean;
  /** Success-tinted surface, e.g. a completed task. */
  completed?: boolean;
  /** Adds pointer cursor + accent hover ring. */
  interactive?: boolean;
  /** Grab cursor, for drag sources — pair with `interactive`. */
  draggable?: boolean;
  /** Suppresses the hover ring while a drag is in progress. */
  dragging?: boolean;
  /** Card fills its container width instead of a fixed width. */
  fluid?: boolean;
  children: ReactNode;
}

export function Card({
  stacked,
  completed,
  interactive,
  draggable,
  dragging,
  fluid,
  children,
  ...rest
}: CardProps) {
  return (
    <div className={`${styles.wrap} ${fluid ? styles.fluid : ''}`}>
      {stacked && <div className={`${styles.backing} ${completed ? styles.completed : ''}`} />}
      <div
        className={[
          styles.card,
          completed ? styles.completed : '',
          interactive ? styles.interactive : '',
          draggable ? styles.grabbable : '',
          dragging ? styles.dragging : '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
}
