import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TextArea>;

const LONG_TEXT = Array.from(
  { length: 12 },
  (_, i) => `Line ${i + 1}: the heifer was observed grazing normally.`,
).join("\n");

export const Default: Story = {
  args: { placeholder: "Write a note…" },
};

export const WithLabel: Story = {
  args: { label: "Note", placeholder: "Write a note…" },
};

export const WithHelperText: Story = {
  args: {
    label: "Comment",
    placeholder: "Write a comment…",
    helperText: "Visible to everyone on the farm.",
  },
};

export const WithError: Story = {
  args: {
    label: "Comment",
    defaultValue: "x",
    error: "Comment must be at least 10 characters.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Comment",
    defaultValue: "Not editable right now.",
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: "Comment",
    defaultValue: "You can read this but not edit it.",
    readOnly: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <TextArea size="sm" placeholder="Small" />
      <TextArea size="base" placeholder="Base" />
    </div>
  ),
};

export const NoResize: Story = {
  args: { resize: "none", placeholder: "Fixed size" },
};

export const AutoResize: Story = {
  args: {
    label: "Note",
    autoResize: true,
    rows: 2,
    maxRows: 6,
    defaultValue: LONG_TEXT,
    helperText: "Grows up to 6 rows, then scrolls.",
  },
};

export const WithCounter: Story = {
  render: () => <CounterDemo />,
};

function CounterDemo() {
  const [value, setValue] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextArea
        label="Controlled, with limit"
        maxLength={50}
        showCount
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type 45+ characters to see warning, 50 for limit"
      />
      <TextArea
        label="Uncontrolled, with limit"
        maxLength={50}
        showCount
        defaultValue="Hello"
      />
      <TextArea
        label="No limit"
        showCount
        defaultValue="Just a running count"
      />
    </div>
  );
}

export const CounterWithHelperAndError: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TextArea
        label="With helper"
        helperText="Keep it short."
        maxLength={100}
        showCount
        defaultValue="Short note"
      />
      <TextArea
        label="With error"
        error="Too short."
        maxLength={100}
        showCount
        defaultValue="Hi"
      />
    </div>
  ),
};
