import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { useRef } from 'react';
import { Tooltip } from './Tooltip';
import { parseShortcut, useShortcut } from './shortcut';
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
  /**
   * Global keyboard shortcut that clicks the button, e.g. `"mod+enter"`. `mod` is ⌘ on Mac and Ctrl elsewhere.
   * The keys are shown as hints inside the button (not on icon-only buttons). Ignored while disabled.
   */
  shortcut?: string;
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
  shortcut?: never;
}

type ButtonProps = BlockButtonProps | LinkButtonProps;

export function Button({
  variant = 'primary',
  size = 'base',
  leadingIcon,
  trailingIcon,
  fullWidth,
  shortcut,
  underline = 'always',
  children,
  className,
  ref,
  ...rest
}: ButtonProps) {
  const innerRef = useRef<HTMLButtonElement | null>(null);
  useShortcut(shortcut, () => innerRef.current?.click(), !rest.disabled);
  const setRefs = (node: HTMLButtonElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  if (variant === 'link') {
    const linkClasses = [styles.link, underline === 'hover' && styles.underlineHover, className].filter(Boolean).join(' ');
    return (
      <button ref={setRefs} type="button" className={linkClasses} {...rest}>
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
  const button = (
    <button ref={setRefs} type="button" className={classes} {...rest}>
      {leadingIcon && <span className={`${styles.icon} ${iconOnly ? '' : styles.leadingIcon}`.trim()}>{leadingIcon}</span>}
      {children}
      {shortcut && !iconOnly && (
        <span className={styles.shortcut} aria-hidden="true">
          {parseShortcut(shortcut).labels.map((k) => (
            <kbd key={k} className={styles.kbd}>
              {k}
            </kbd>
          ))}
        </span>
      )}
      {trailingIcon && <span className={`${styles.icon} ${styles.trailingIcon}`}>{trailingIcon}</span>}
    </button>
  );
  return iconOnly ? <Tooltip content={rest['aria-label']}>{button}</Tooltip> : button;
}
