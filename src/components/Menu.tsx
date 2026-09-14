import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Menu.module.css';

interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
}

export function Menu({ children, ...rest }: MenuProps) {
  return (
    <div role="menu" className={styles.menu} {...rest}>
      {children}
    </div>
  );
}

export function MenuDivider() {
  return <div className={styles.divider} role="separator" />;
}
