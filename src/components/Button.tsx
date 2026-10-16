import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'dangerous';
type ButtonSize = 'sm' | 'base';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon shown before the label. Omit `children` to render an icon-only square button — pass `aria-label` in that case. */
  leadingIcon?: ReactNode;
  /** Icon shown after the label. */
  trailingIcon?: ReactNode;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  children?: ReactNode;
  /**
   * Extra classes for layout around the button — responsive visibility,
   * positioning, spacing. Appended after the variant classes.
   */
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'base',
  leadingIcon,
  trailingIcon,
  fullWidth,
  children,
  className,
  ref,
  ...rest
}: ButtonProps) {
  const iconOnly = !children && Boolean(leadingIcon);
  const classes = [
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button ref={ref} type="button" className={classes} {...rest}>
      {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
    </button>
  );
}
