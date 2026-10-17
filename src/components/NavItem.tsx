import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ElementType,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import styles from './NavItem.module.css';

const ITEM_ATTR = 'data-nav-item';

const NavListContext = createContext(false);

interface NavItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /** Label, truncated with an ellipsis. */
  children: ReactNode;
  icon?: ReactNode;
  /** Node on the right (counter, arrow). */
  trailing?: ReactNode;
  /** Current section: sets `aria-current="page"` and the filled style. */
  active?: boolean;
  /** Render another element instead of `<button>`, e.g. a router Link. Without `as`, `href` renders `<a>`. */
  as?: ElementType;
  href?: string;
  /** Layout around the item, e.g. hiding at a breakpoint. */
  className?: string;
}

export function NavItem({
  icon,
  trailing,
  active,
  as,
  href,
  className,
  children,
  ...rest
}: NavItemProps) {
  const inList = useContext(NavListContext);
  const Component: ElementType = as ?? (href !== undefined ? 'a' : 'button');
  const isNativeButton = Component === 'button';

  const classes = [styles.item, active && styles.active, inList && styles.inList, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      {...(isNativeButton ? { type: 'button' } : {})}
      {...(href !== undefined ? { href } : {})}
      {...{ [ITEM_ATTR]: '' }}
      aria-current={active ? 'page' : undefined}
      className={classes}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </Component>
  );
}

interface NavListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode;
  className?: string;
}

interface HoverBox {
  top: number;
  height: number;
}

/**
 * Optional wrapper for a group of NavItems: a single hover highlight glides between
 * neighbouring items instead of each item lighting up on its own.
 */
export function NavList({ children, className, ...rest }: NavListProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<HoverBox | null>(null);
  const [visible, setVisible] = useState(false);
  // Skip the transition when the highlight (re)appears so it only glides between items.
  const [animate, setAnimate] = useState(false);

  const moveTo = useCallback((target: EventTarget | null) => {
    const root = rootRef.current;
    const item = target instanceof Element ? target.closest<HTMLElement>(`[${ITEM_ATTR}]`) : null;
    // Gaps between items are not items: keep the highlight where it is so it can glide across them.
    if (!root || !item || !root.contains(item)) return;
    if (item.matches(':disabled, [aria-disabled="true"], [hidden]')) {
      setVisible(false);
      return;
    }
    const rootRect = root.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setAnimate(visible);
    setBox({ top: itemRect.top - rootRect.top, height: itemRect.height });
    setVisible(true);
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) setAnimate(false);
  }, [visible]);

  return (
    <NavListContext.Provider value>
      <div
        ref={rootRef}
        className={[styles.list, className].filter(Boolean).join(' ')}
        onMouseOver={(event: MouseEvent) => moveTo(event.target)}
        onMouseLeave={() => setVisible(false)}
        onFocus={(event: FocusEvent) => event.target.matches(':focus-visible') && moveTo(event.target)}
        onBlur={() => setVisible(false)}
        {...rest}
      >
        <span
          aria-hidden
          className={[styles.glide, animate && styles.glideAnimated, visible && styles.glideVisible]
            .filter(Boolean)
            .join(' ')}
          style={box ? { translate: `0 ${box.top}px`, height: box.height } : undefined}
        />
        {children}
      </div>
    </NavListContext.Provider>
  );
}
