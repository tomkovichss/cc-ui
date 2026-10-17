import { X } from 'lucide-react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './Tag.module.css';
import chipStyles from './ChipBase.module.css';

type TagVariant =
  | 'neutral'
  | 'pill'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger'
  | 'count'
  | 'chip';

type InteractiveVariant = Exclude<TagVariant, 'count'>;

type NativeProps = Omit<HTMLAttributes<HTMLElement>, 'className' | 'onClick' | 'children'>;

type RemoveProps =
  | { onRemove?: undefined; removeLabel?: undefined }
  | {
      /** Shows a × button on the right. */
      onRemove: () => void;
      /** Accessible name of the × button. */
      removeLabel: string;
    };

type CountTagProps = NativeProps & {
  variant: 'count';
  children: ReactNode;
  onClick?: never;
  pressed?: never;
  disabled?: never;
  leading?: never;
  onRemove?: never;
  removeLabel?: never;
};

type RegularTagProps = NativeProps &
  RemoveProps & {
    variant?: InteractiveVariant;
    children: ReactNode;
    /** Makes the tag pressable: renders a <button type="button"> instead of a <span>. */
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    /** Toggle state, exposed as aria-pressed. Ignored without onClick. */
    pressed?: boolean;
    disabled?: boolean;
    /** Slot before the text, e.g. a colour dot in a legend. */
    leading?: ReactNode;
  };

export type TagProps = CountTagProps | RegularTagProps;

function cx(...names: Array<string | false | undefined>) {
  return names.filter(Boolean).join(' ');
}

export function Tag(props: TagProps) {
  if (props.variant === 'count') {
    const { variant, children, ...rest } = props;
    return (
      <span className={styles[variant]} {...rest}>
        {children}
      </span>
    );
  }

  const {
    variant = 'neutral',
    children,
    onClick,
    pressed,
    disabled,
    leading,
    onRemove,
    removeLabel,
    ...rest
  } = props;

  const pressable = !!onClick;
  const removable = !!onRemove;
  const isChipLike = variant === 'chip';
  const isPressed = pressable && pressed === true;

  const rootClass = cx(
    styles[variant],
    isChipLike && chipStyles.chip,
    isChipLike && isPressed && chipStyles.selected,
    isChipLike && disabled && chipStyles.disabled,
    (pressable || removable) && styles.interactive,
    isPressed && styles.pressed,
    disabled && styles.disabled,
    (leading != null || removable) && styles.slots,
  );

  const content = (
    <>
      {leading != null && <span className={styles.leading}>{leading}</span>}
      {children}
    </>
  );

  // Removable: the root stays a <span> so the two buttons are siblings, never nested.
  if (removable) {
    return (
      <span className={cx(rootClass, styles.removable)} {...rest}>
        {pressable ? (
          <button
            type="button"
            className={cx(styles.main, styles.slots)}
            aria-pressed={pressed}
            disabled={disabled}
            onClick={onClick}
          >
            {content}
          </button>
        ) : (
          content
        )}
        <button
          type="button"
          className={styles.remove}
          aria-label={removeLabel}
          disabled={disabled}
          onClick={() => onRemove()}
        >
          <X size={12} aria-hidden="true" />
        </button>
      </span>
    );
  }

  if (pressable) {
    return (
      <button
        type="button"
        className={cx(rootClass, styles.button)}
        aria-pressed={pressed}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {content}
      </button>
    );
  }

  return (
    <span className={rootClass} {...rest}>
      {content}
    </span>
  );
}
