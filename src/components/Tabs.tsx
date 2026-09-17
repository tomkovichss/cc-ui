import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TransitionEvent,
} from 'react';
import styles from './Tabs.module.css';

type TabsVariant = 'line' | 'box';
type TabsSize = 'base' | 'sm';

interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  'aria-label'?: string;
}

export function Tabs({ items, value, onChange, variant = 'line', size = 'base', ...rest }: TabsProps) {
  const enabledValues = items.filter((item) => !item.disabled).map((item) => item.value);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const prevValueRef = useRef(value);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(
    null,
  );
  const [pillPhase, setPillPhase] = useState<'idle' | 'moving' | 'settling'>('idle');

  useLayoutEffect(() => {
    const selectedTab = tabRefs.current.get(value);
    if (!selectedTab) return;
    setIndicatorStyle({ left: selectedTab.offsetLeft, width: selectedTab.offsetWidth });

    if (variant === 'box' && prevValueRef.current !== value) {
      setPillPhase('moving');
    }
    prevValueRef.current = value;
  }, [value, items, variant, size]);

  function handlePillTransitionEnd(event: TransitionEvent<HTMLSpanElement>) {
    if (event.propertyName !== 'scale') return;
    if (pillPhase === 'moving') setPillPhase('settling');
    else if (pillPhase === 'settling') setPillPhase('idle');
  }

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      const selectedTab = tabRefs.current.get(value);
      if (!selectedTab) return;
      setIndicatorStyle({ left: selectedTab.offsetLeft, width: selectedTab.offsetWidth });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [value]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = enabledValues.indexOf(value);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % enabledValues.length;
    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledValues.length) % enabledValues.length;
    }
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = enabledValues.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      onChange(enabledValues[nextIndex]);
    }
  }

  return (
    <div
      ref={containerRef}
      role="tablist"
      className={[styles[variant], variant === 'box' && size === 'sm' && styles.sm]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {indicatorStyle && (
        <span
          aria-hidden
          className={[
            styles.indicator,
            variant === 'line' ? styles.indicatorLine : styles.indicatorBox,
            pillPhase === 'settling' && styles.settling,
          ]
            .filter(Boolean)
            .join(' ')}
          onTransitionEnd={handlePillTransitionEnd}
          style={{
            translate: `${indicatorStyle.left}px 0`,
            scale: variant === 'box' && pillPhase === 'moving' ? 0.92 : 1,
            width: indicatorStyle.width,
          }}
        />
      )}
      {items.map((item) => {
        const selected = item.value === value;
        return (
          <button
            key={item.value}
            ref={(node) => {
              if (node) tabRefs.current.set(item.value, node);
              else tabRefs.current.delete(item.value);
            }}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={item.disabled}
            tabIndex={selected ? 0 : -1}
            className={[styles.tab, selected && styles.selected].filter(Boolean).join(' ')}
            onClick={() => !item.disabled && onChange(item.value)}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
