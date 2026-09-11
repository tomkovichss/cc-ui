import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Tag.module.css';

type TagVariant = 'neutral' | 'pill' | 'accent' | 'success' | 'danger' | 'count';

interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
  variant?: TagVariant;
  children: ReactNode;
}

export function Tag({ variant = 'neutral', children, ...rest }: TagProps) {
  return (
    <span className={styles[variant]} {...rest}>
      {children}
    </span>
  );
}
