import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'dangerous';
type ButtonSize = 'sm' | 'base' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon shown before the label. Omit `children` to render an icon-only square button — pass `aria-label` in that case. */
  leadingIcon?: ReactNode;
  /** Icon shown after the label. */
  trailingIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'base',
  leadingIcon,
  trailingIcon,
  children,
  ...rest
}: ButtonProps) {
  const iconOnly = !children && Boolean(leadingIcon);
  return (
    <button
      type="button"
      className={`${styles[variant]} ${styles[size]}${iconOnly ? ` ${styles.iconOnly}` : ''}`}
      {...rest}
    >
      {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
    </button>
  );
}
