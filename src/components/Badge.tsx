import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'base' | 'sm' | 'xs';

export type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'children'> & {
  variant?: BadgeVariant;
  /** base — 36px, sm — 28px, xs — 20px. */
  size?: BadgeSize;
  children: ReactNode;
  /** Slot before the text, e.g. an icon. */
  iconLeft?: ReactNode;
  /** Slot after the text, e.g. an icon. */
  iconRight?: ReactNode;
  /** Shows a coloured dot (currentColor) before the text. */
  dot?: boolean;
};

function cx(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(' ');
}

export function Badge({
  variant = 'neutral',
  size = 'base',
  children,
  iconLeft,
  iconRight,
  dot,
  ...rest
}: BadgeProps) {
  return (
    <span className={cx(styles.badge, styles[variant], styles[size])} {...rest}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {iconLeft != null && <span className={styles.icon}>{iconLeft}</span>}
      {children}
      {iconRight != null && <span className={styles.icon}>{iconRight}</span>}
    </span>
  );
}
