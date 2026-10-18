import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CreditCard, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './Button';
import { TextField } from './TextField';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    docs: {
      description: {
        component: [
          'A dialog interrupts and disables the app until confirmed, dismissed or a required action is taken. Use it sparingly: to stop destructive actions, confirm irreversible choices, or gather info required to proceed.',
          '',
          '- Headlines are brief, clear and actionable ("Delete Visa card ending 9012?"). Button labels repeat the action; never a bare Yes / No.',
          '- Do not add a third action such as "Learn more" that navigates away.',
          '- Field errors go inline next to the field, not in a dialog. Only general failures (network, save failed) use a basic dialog.',
          '- A horizontal dialog without a cover has no ×, so it must have a visible Cancel button.',
        ].join('\n'),
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

function Opener({ label, children }: { label: string; children: (open: boolean, close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      {children(open, () => setOpen(false))}
    </>
  );
}

export const Vertical: Story = {
  render: () => (
    <Opener label="Open dialog">
      {(open, close) => (
        <Modal open={open} onClose={close} layout="vertical">
          <Modal.Message>
            <Modal.Icon tone="danger">
              <Trash2 />
            </Modal.Icon>
            <Modal.Title>Delete this card?</Modal.Title>
            <Modal.Description>The card will be permanently removed from your account.</Modal.Description>
            <Modal.Hint>This cannot be undone.</Modal.Hint>
          </Modal.Message>
          <Modal.Footer>
            <Button onClick={close}>Keep card</Button>
            <Button variant="secondary" onClick={close}>No, thanks</Button>
            <Button variant="dangerous" onClick={close}>Yes, delete this card</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Opener>
  ),
};

export const WithCover: Story = {
  render: () => (
    <Opener label="Open dialog">
      {(open, close) => (
        <Modal open={open} onClose={close} layout="horizontal">
          <Modal.Cover onClose={close}>
            <CreditCard size={32} />
          </Modal.Cover>
          <Modal.Message>
            <Modal.Icon tone="brand">
              <CreditCard />
            </Modal.Icon>
            <Modal.Title>Add a payment method</Modal.Title>
            <Modal.Description>You will not be charged until the trial ends.</Modal.Description>
          </Modal.Message>
          <Modal.Footer>
            <Button onClick={close}>Add card</Button>
            <Button variant="secondary" onClick={close}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Opener>
  ),
};

export const HorizontalWithContent: Story = {
  render: () => (
    <Opener label="Open dialog">
      {(open, close) => (
        <Modal open={open} onClose={close} layout="horizontal" onSubmit={(e) => { e.preventDefault(); close(); }}>
          <Modal.Message>
            <Modal.Icon>
              <AlertTriangle />
            </Modal.Icon>
            <Modal.Title>Rename farm</Modal.Title>
            <Modal.Description>Choose a name your team will recognise.</Modal.Description>
            <Modal.Body>
              <TextField label="Farm name" defaultValue="Bill" error="Farm name already taken." />
            </Modal.Body>
          </Modal.Message>
          <Modal.Footer>
            <Button type="submit">Save</Button>
            <Button variant="secondary" onClick={close}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Opener>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Opener label="Open dialog">
      {(open, close) => (
        <Modal open={open} onClose={close} layout="horizontal">
          <Modal.Message>
            <Modal.Title>Terms of use</Modal.Title>
            {Array.from({ length: 24 }, (_, i) => (
              <Modal.Description key={i}>Paragraph {i + 1}. The message scrolls while the footer stays visible.</Modal.Description>
            ))}
          </Modal.Message>
          <Modal.Footer>
            <Button onClick={close}>Accept</Button>
            <Button variant="secondary" onClick={close}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Opener>
  ),
};

export const MobileFullscreen: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <Opener label="Open dialog">
      {(open, close) => (
        <Modal open={open} onClose={close} mobile="fullscreen">
          <Modal.Message>
            <Modal.Icon>
              <AlertTriangle />
            </Modal.Icon>
            <Modal.Title>Leave without saving?</Modal.Title>
            <Modal.Description>Your changes will be lost.</Modal.Description>
          </Modal.Message>
          <Modal.Footer>
            <Button variant="dangerous" onClick={close}>Yes, discard changes</Button>
            <Button variant="secondary" onClick={close}>Keep editing</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Opener>
  ),
};

export const Confirm: Story = {
  render: () => (
    <Opener label="Open confirm">
      {(open, close) => (
        <ConfirmDialog
          open={open}
          onClose={close}
          onConfirm={close}
          icon={<Trash2 />}
          tone="dangerous"
          title="Delete Visa card ending 9012?"
          confirmLabel="Yes, delete card"
          cancelLabel="No, thanks"
        />
      )}
    </Opener>
  ),
};

export const Stacked: Story = {
  render: () => {
    const Inner = () => {
      const [confirm, setConfirm] = useState(false);
      return (
        <Opener label="Open form">
          {(open, close) => (
            <>
              <Modal open={open} onClose={close} layout="horizontal" isTop={!confirm}>
                <Modal.Message>
                  <Modal.Title>Edit user</Modal.Title>
                  <Modal.Description>Escape closes only the topmost dialog.</Modal.Description>
                </Modal.Message>
                <Modal.Footer>
                  <Button onClick={() => setConfirm(true)}>Delete user</Button>
                  <Button variant="secondary" onClick={close}>Cancel</Button>
                </Modal.Footer>
              </Modal>
              <ConfirmDialog
                open={confirm}
                onClose={() => setConfirm(false)}
                onConfirm={() => setConfirm(false)}
                title="Delete this user?"
                confirmLabel="Yes, delete user"
                tone="dangerous"
              />
            </>
          )}
        </Opener>
      );
    };
    return <Inner />;
  },
};
