import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Button.module.css';

/** `onDark` is for buttons placed on dark surfaces. `link` is inline text in a flow of copy, not a block button. */
type BlockButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'onDark' | 'dangerous';
type ButtonSize = 'xs' | 'sm' | 'base' | 'lg';

interface ButtonBaseProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  children?: ReactNode;
  /**
   * Extra classes for layout around the button — responsive visibility,
   * positioning, spacing. Appended after the variant classes.
   */
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

interface BlockButtonProps extends ButtonBaseProps {
  variant?: BlockButtonVariant;
  size?: ButtonSize;
  /** Icon shown before the label. Omit `children` to render an icon-only square button — pass `aria-label` in that case; it is also shown as a tooltip on hover and keyboard focus. */
  leadingIcon?: ReactNode;
  /** Icon shown after the label. */
  trailingIcon?: ReactNode;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
  underline?: never;
}

interface LinkButtonProps extends ButtonBaseProps {
  /** Inline text that inherits font size and line height from its parent and wraps with the surrounding copy. */
  variant: 'link';
  /** When to underline the text. */
  underline?: 'always' | 'hover';
  size?: never;
  leadingIcon?: never;
  trailingIcon?: never;
  fullWidth?: never;
}

type ButtonProps = BlockButtonProps | LinkButtonProps;

export function Button({
  variant = 'primary',
  size = 'base',
  leadingIcon,
  trailingIcon,
  fullWidth,
  underline = 'always',
  children,
  className,
  ref,
  ...rest
}: ButtonProps) {
  if (variant === 'link') {
    const linkClasses = [styles.link, underline === 'hover' && styles.underlineHover, className].filter(Boolean).join(' ');
    return (
      <button ref={ref} type="button" className={linkClasses} {...rest}>
        {children}
      </button>
    );
  }
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
    <button
      ref={ref}
      type="button"
      className={classes}
      data-tooltip={iconOnly ? rest['aria-label'] : undefined}
      {...rest}
    >
      {leadingIcon && <span className={`${styles.icon} ${iconOnly ? '' : styles.leadingIcon}`.trim()}>{leadingIcon}</span>}
      {children}
      {trailingIcon && <span className={`${styles.icon} ${styles.trailingIcon}`}>{trailingIcon}</span>}
    </button>
  );
}
