import type { HTMLAttributes, ReactNode } from 'react';
import styles from './EmptyState.module.css';

type EmptyStateTone = 'neutral' | 'success' | 'warning' | 'danger';

interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'title'> {
  /** Colours the surface, border and icon circle. `success` is the "all clear" look. */
  tone?: EmptyStateTone;
  /** Glyph inside the round badge, ~24px — it inherits the tone's text colour. */
  icon?: ReactNode;
  title: ReactNode;
  /** Description. Wrap key values in <strong> to emphasise them. */
  children?: ReactNode;
  /** Call-to-action under the description, e.g. a <Button>. */
  action?: ReactNode;
}

export function EmptyState({
  tone = 'neutral',
  icon,
  title,
  children,
  action,
  ...rest
}: EmptyStateProps) {
  return (
    <div className={`${styles.root} ${tone !== 'neutral' ? styles[tone] : ''}`} {...rest}>
      {icon != null && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        {children != null && <div className={styles.text}>{children}</div>}
        {action != null && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  );
}
