import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoPreview } from './PhotoPreview';

const svgUri = (bg: string, fg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="${bg}"/><circle cx="120" cy="96" r="44" fill="${fg}"/><rect x="50" y="150" width="140" height="90" rx="40" fill="${fg}"/></svg>`,
  )}`;

const PHOTO = svgUri('#4b5560', '#9aa6b1');
const BROKEN = '/this-image-does-not-exist.jpg';

const meta: Meta<typeof PhotoPreview> = {
  title: 'Components/PhotoPreview',
  component: PhotoPreview,
  parameters: { layout: 'fullscreen' },
  args: { src: PHOTO, size: 120 },
};
export default meta;

type Story = StoryObj<typeof PhotoPreview>;

const trigger = { padding: '8px 12px', cursor: 'default', display: 'inline-block' } as const;

export const Playground: Story = {
  render: (args) => (
    <div style={{ padding: 80 }}>
      <PhotoPreview {...args}>
        <span style={trigger}>Victor Ruiz Morales</span>
      </PhotoPreview>
    </div>
  ),
};

/** The portal is not clipped by `overflow-x: auto` and sits above the sticky first column. */
export const OnTableRow: Story = {
  render: () => (
    <div style={{ padding: 40, maxWidth: 420, overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: 800 }}>
        <tbody>
          {['Victor Ruiz Morales', 'Worker-M82', 'Anna Petrova'].map((name) => (
            <tr key={name}>
              <PhotoPreview src={PHOTO}>
                <td style={{ position: 'sticky', left: 0, background: '#fff', padding: 12, width: 200 }}>
                  {name}
                </td>
              </PhotoPreview>
              <td style={{ padding: 12 }}>Milking parlour</td>
              <td style={{ padding: 12 }}>Morning shift</td>
              <td style={{ padding: 12 }}>12 videos</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

/** Near the right or bottom edge the preview flips to the other side of the cursor. */
export const ViewportEdges: Story = {
  render: () => (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 8,
        boxSizing: 'border-box',
      }}
    >
      <PhotoPreview src={PHOTO}>
        <span style={trigger}>Bottom left</span>
      </PhotoPreview>
      <PhotoPreview src={PHOTO}>
        <span style={trigger}>Bottom right</span>
      </PhotoPreview>
    </div>
  ),
};

/** Missing or broken `src`: nothing appears and the child is untouched. */
export const MissingOrBroken: Story = {
  render: () => (
    <div style={{ padding: 80, display: 'flex', gap: 24 }}>
      <PhotoPreview>
        <span style={trigger}>No src</span>
      </PhotoPreview>
      <PhotoPreview src={BROKEN}>
        <span style={trigger}>Broken src</span>
      </PhotoPreview>
    </div>
  ),
};
