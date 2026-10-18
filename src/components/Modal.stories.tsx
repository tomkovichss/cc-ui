import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, Stethoscope, Trash2 } from 'lucide-react';
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
          '- Headlines are brief, clear and actionable ("Remove cow #1042 from the herd?"). Button labels repeat the action; never a bare Yes / No.',
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
            <Modal.Title>Remove cow #1042 from the herd?</Modal.Title>
            <Modal.Description>She will leave the active herd list. Her milking history is kept.</Modal.Description>
            <Modal.Hint>You can restore her from the archive within 30 days.</Modal.Hint>
          </Modal.Message>
          <Modal.Footer>
            <Button onClick={close}>Keep in herd</Button>
            <Button variant="secondary" onClick={close}>Cancel</Button>
            <Button variant="dangerous" onClick={close}>Yes, remove cow</Button>
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
            <Stethoscope size={32} />
          </Modal.Cover>
          <Modal.Message>
            <Modal.Icon tone="brand">
              <Stethoscope />
            </Modal.Icon>
            <Modal.Title>Schedule a vet visit</Modal.Title>
            <Modal.Description>The vet will be notified about the 12 cows in Barn B.</Modal.Description>
          </Modal.Message>
          <Modal.Footer>
            <Button onClick={close}>Schedule visit</Button>
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
            <Modal.Title>Rename cow group</Modal.Title>
            <Modal.Description>Choose a name your milking team will recognise.</Modal.Description>
            <Modal.Body>
              <TextField label="Group name" defaultValue="Fresh cows" error="A group with this name already exists." />
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
            <Modal.Title>Milking protocol</Modal.Title>
            {Array.from({ length: 24 }, (_, i) => (
              <Modal.Description key={i}>Step {i + 1}. The message scrolls while the footer stays visible.</Modal.Description>
            ))}
          </Modal.Message>
          <Modal.Footer>
            <Button onClick={close}>Mark as read</Button>
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
            <Modal.Title>Discard milking session?</Modal.Title>
            <Modal.Description>Yields recorded for this session will be lost.</Modal.Description>
          </Modal.Message>
          <Modal.Footer>
            <Button variant="dangerous" onClick={close}>Yes, discard session</Button>
            <Button variant="secondary" onClick={close}>Keep recording</Button>
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
          title="Remove cow #1042 from the herd?"
          confirmLabel="Yes, remove cow"
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
                  <Modal.Title>Edit cow #1042</Modal.Title>
                  <Modal.Description>Escape closes only the topmost dialog.</Modal.Description>
                </Modal.Message>
                <Modal.Footer>
                  <Button onClick={() => setConfirm(true)}>Remove cow</Button>
                  <Button variant="secondary" onClick={close}>Cancel</Button>
                </Modal.Footer>
              </Modal>
              <ConfirmDialog
                open={confirm}
                onClose={() => setConfirm(false)}
                onConfirm={() => setConfirm(false)}
                title="Remove cow #1042 from the herd?"
                confirmLabel="Yes, remove cow"
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
