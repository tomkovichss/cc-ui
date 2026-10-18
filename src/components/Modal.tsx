import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { FormEvent, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from './Button';
import styles from './Modal.module.css';

type ModalLayout = 'vertical' | 'horizontal';
type MobilePresentation = 'sheet' | 'fullscreen';
type IconTone = 'neutral' | 'brand' | 'danger';

const ANIMATION_MS = 200;
const MOBILE_QUERY = '(max-width: 639px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FOCUSABLE =
  'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

interface ModalContextValue {
  layout: ModalLayout;
  titleId: string;
  descriptionId: string;
  isMobile: boolean;
  dismissible: boolean;
  setHasDescription: (value: boolean) => void;
  requestClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModalContext(part: string): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error(`${part} must be rendered inside <Modal>`);
  return ctx;
}

/** Open modals in opening order; only the last one reacts to Escape. */
const modalStack: symbol[] = [];

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export interface ModalProps {
  open: boolean;
  /** Called after the exit animation, on Escape, backdrop click or the × button. */
  onClose: () => void;
  /** `vertical` is 320 px wide (short questions); `horizontal` is 520 px (extra controls, longer text). */
  layout?: ModalLayout;
  /** Presentation below the `sm` breakpoint. */
  mobile?: MobilePresentation;
  /** Render the window as a `<form>`; a `type="submit"` footer button then works natively. */
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  /** Set to `false` to block Escape, backdrop and × (e.g. while a request is in flight). */
  dismissible?: boolean;
  /** Skip the animation when the modal is already open on mount. */
  instantInitialOpen?: boolean;
  /** Where to portal to. Falls back to `document.body` when nothing matches. */
  portalSelector?: string;
  /** Escape closes only the topmost modal; pass `false` to opt a modal out of the stack. */
  isTop?: boolean;
  /** `alertdialog` for destructive confirmations. */
  role?: 'dialog' | 'alertdialog';
  'aria-labelledby'?: string;
  'data-testid'?: string;
  className?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  layout = 'vertical',
  mobile = 'sheet',
  onSubmit,
  dismissible = true,
  instantInitialOpen = false,
  portalSelector = '#container',
  isTop = true,
  role = 'dialog',
  'aria-labelledby': ariaLabelledBy,
  'data-testid': dataTestId,
  className,
  children,
}: ModalProps) {
  const generatedId = useId();
  const titleId = `${generatedId}-title`;
  const descriptionId = `${generatedId}-description`;
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(open && instantInitialOpen);
  const [hasDescription, setHasDescription] = useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const windowRef = useRef<HTMLElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeInitiatedRef = useRef(false);
  const pointerStartedInsideRef = useRef(false);
  const stackId = useRef(Symbol('modal'));
  const initialOpenRef = useRef(open);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  // Mount, then flip to visible on the next frame so the fade runs.
  useEffect(() => {
    if (open) {
      if (closeInitiatedRef.current) return; // an async `open` update must not re-open a closing window
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setRendered(true);
      if (initialOpenRef.current && instantInitialOpen) {
        setVisible(true);
        return;
      }
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    closeInitiatedRef.current = false;
    setVisible(false);
    if (!rendered) return;
    const timer = setTimeout(() => setRendered(false), reducedMotion ? 0 : ANIMATION_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Return focus to the opener once the window is gone.
  useEffect(() => {
    if (!rendered && openerRef.current) {
      openerRef.current.focus?.();
      openerRef.current = null;
    }
  }, [rendered]);

  const requestClose = useCallback(() => {
    if (!dismissible || closeInitiatedRef.current) return;
    closeInitiatedRef.current = true;
    setVisible(false);
    const delay = reducedMotion ? 0 : ANIMATION_MS;
    window.setTimeout(() => onCloseRef.current(), delay);
  }, [dismissible, reducedMotion]);

  // Stack registration, Escape, scroll lock, initial focus.
  useEffect(() => {
    if (!rendered) return;
    const id = stackId.current;
    if (isTop) modalStack.push(id);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalStack[modalStack.length - 1] === id) {
        e.preventDefault();
        requestClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    windowRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const idx = modalStack.indexOf(id);
      if (idx !== -1) modalStack.splice(idx, 1);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [rendered, isTop, requestClose]);

  const onWindowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !windowRef.current) return;
    const items = Array.from(windowRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === windowRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!mounted || !rendered) return null;
  const portalTarget = document.querySelector(portalSelector) ?? document.body;

  const classes = [
    styles.modal,
    styles[layout],
    styles[mobile],
    visible && styles.visible,
    instantInitialOpen && styles.instant,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const windowProps = {
    role,
    'aria-modal': true as const,
    'aria-labelledby': ariaLabelledBy ?? titleId,
    'aria-describedby': hasDescription ? descriptionId : undefined,
    tabIndex: -1,
    className: classes,
    'data-testid': dataTestId,
    onKeyDown: onWindowKeyDown,
  };

  const ctx: ModalContextValue = {
    layout,
    titleId: ariaLabelledBy ?? titleId,
    descriptionId,
    isMobile,
    dismissible,
    setHasDescription,
    requestClose,
  };

  return createPortal(
    <ModalContext.Provider value={ctx}>
      <div
        className={`${styles.backdrop} ${visible ? styles.visible : ''} ${instantInitialOpen ? styles.instant : ''}`.trim()}
        onPointerDown={(e) => {
          pointerStartedInsideRef.current = e.target !== e.currentTarget;
        }}
        onClick={(e) => {
          // A drag that began inside the window and ended on the backdrop must not close it.
          if (e.target === e.currentTarget && !pointerStartedInsideRef.current) requestClose();
          pointerStartedInsideRef.current = false;
        }}
      >
        {onSubmit ? (
          <form ref={windowRef as React.Ref<HTMLFormElement>} onSubmit={onSubmit} {...windowProps}>
            {children}
          </form>
        ) : (
          <div ref={windowRef as React.Ref<HTMLDivElement>} {...windowProps}>
            {children}
          </div>
        )}
      </div>
    </ModalContext.Provider>,
    portalTarget,
  );
}

interface CoverProps {
  children?: ReactNode;
  /** When given, renders the × button in the corner. */
  onClose?: () => void;
}

function Cover({ children, onClose }: CoverProps) {
  const { requestClose, dismissible } = useModalContext('Modal.Cover');
  return (
    <div className={styles.cover}>
      {children}
      {onClose && (
        <Button
          variant="tertiary"
          leadingIcon={<X />}
          aria-label="Close"
          data-testid="modal-close"
          className={styles.closeButton}
          disabled={!dismissible}
          onClick={() => {
            requestClose();
          }}
        />
      )}
    </div>
  );
}

function Message({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  const icon = items.filter((child) => isValidElement(child) && child.type === Icon);
  const rest = items.filter((child) => !icon.includes(child));
  return (
    <div className={styles.message}>
      {icon}
      <div className={styles.content}>{rest}</div>
    </div>
  );
}

interface IconProps {
  children: ReactNode;
  tone?: IconTone;
}

function Icon({ children, tone = 'neutral' }: IconProps) {
  return (
    <div className={`${styles.icon} ${styles[`tone-${tone}`]}`} aria-hidden="true">
      {children}
    </div>
  );
}

function Title({ children, id }: { children: ReactNode; id?: string }) {
  const { titleId } = useModalContext('Modal.Title');
  return (
    <h2 id={id ?? titleId} className={styles.title}>
      {children}
    </h2>
  );
}

function Description({ children }: { children: ReactNode }) {
  const { descriptionId, setHasDescription } = useModalContext('Modal.Description');
  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return (
    <p id={descriptionId} className={styles.description}>
      {children}
    </p>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return <p className={styles.hint}>{children}</p>;
}

function Body({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

function Footer({ children }: { children: ReactNode }) {
  const { isMobile } = useModalContext('Modal.Footer');
  const items = isMobile
    ? Children.map(children, (child) =>
        isValidElement(child) && child.type === Button
          ? cloneElement(child as ReactElement<{ size?: string }>, { size: 'lg' })
          : child,
      )
    : children;
  return <div className={styles.footer}>{items}</div>;
}

Modal.Cover = Cover;
Modal.Message = Message;
Modal.Icon = Icon;
Modal.Title = Title;
Modal.Description = Description;
Modal.Hint = Hint;
Modal.Body = Body;
Modal.Footer = Footer;
