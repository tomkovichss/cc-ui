import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Check } from 'lucide-react';
import styles from './MenuItem.module.css';

interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Raw content before the icon and label, e.g. a checkbox indicator. */
  leading?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
  destructive?: boolean;
  /** `base` (44px) matches a 44px trigger; `sm` (36px) matches a 36px one. */
  size?: 'sm' | 'base';
  children: ReactNode;
}

export function MenuItem({ leading, icon, trailing, selected, destructive, size = 'sm', children, ...rest }: MenuItemProps) {
  const classes = [styles.item, size === 'base' && styles.base, selected && styles.selected, destructive && styles.destructive]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" role="menuitem" className={classes} {...rest}>
      {leading && <span className={styles.leading}>{leading}</span>}
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
      {selected && (
        <span className={styles.check}>
          <Check />
        </span>
      )}
    </button>
  );
}
