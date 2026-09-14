import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './MenuItem.module.css';

interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  icon?: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
  destructive?: boolean;
  children: ReactNode;
}

export function MenuItem({ icon, trailing, selected, destructive, children, ...rest }: MenuItemProps) {
  const classes = [styles.item, selected && styles.selected, destructive && styles.destructive]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" role="menuitem" className={classes} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </button>
  );
}
