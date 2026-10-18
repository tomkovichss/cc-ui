import type { ReactNode } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Repeat the action ("Yes, delete card"), never a bare "Yes". */
  confirmLabel: string;
  cancelLabel?: string;
  /** `dangerous` renders a destructive confirm button and uses `role="alertdialog"`. */
  tone?: 'default' | 'dangerous';
  /** Disables the buttons and all dismissal. */
  loading?: boolean;
  'data-testid'?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  loading = false,
  'data-testid': dataTestId,
}: ConfirmDialogProps) {
  const dangerous = tone === 'dangerous';
  return (
    <Modal open={open} onClose={onClose} layout="vertical" dismissible={!loading} data-testid={dataTestId} role={dangerous ? 'alertdialog' : undefined}>
      <Modal.Message>
        {icon && <Modal.Icon tone={dangerous ? 'danger' : 'neutral'}>{icon}</Modal.Icon>}
        <Modal.Title>{title}</Modal.Title>
        {description && <Modal.Description>{description}</Modal.Description>}
      </Modal.Message>
      <Modal.Footer>
        <Button variant={dangerous ? 'dangerous' : 'primary'} disabled={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button variant="secondary" disabled={loading} onClick={onClose}>
          {cancelLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
