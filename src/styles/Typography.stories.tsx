import type { Meta, StoryObj } from "@storybook/react-vite";
import fontsRaw from "./fonts.css?raw";
import styles from "./Typography.stories.module.css";

type Style = {
  name: string;
  classNames: string;
  useCase: string;
  sample: string;
};

// Names follow `.text-{size} [.medium] [.2-line]` and match the text styles in Figma 1:1.
const multiLine =
  "Notes about this worker span more than one line, so the tighter line height keeps it compact.";

const styleList: Style[] = [
  {
    name: ".text-sm",
    classNames: "text-base text-sm",
    useCase:
      "Secondary/supporting text — helper text, captions, timestamps, metadata.",
    sample: "Last updated 5 minutes ago",
  },
  {
    name: ".text-sm .medium",
    classNames: "text-base text-medium text-sm",
    useCase: "Emphasized small text — badges, tags, small labels.",
    sample: "Pending review",
  },
  {
    name: ".text-base",
    classNames: "text-base",
    useCase: "Default for almost all text — body copy, labels, descriptions.",
    sample: "The quick brown fox jumps over the lazy dog.",
  },
  {
    name: ".text-base .medium",
    classNames: "text-base text-medium",
    useCase: "Links, buttons, and other interactive or emphasized inline text.",
    sample: "View all shifts",
  },
  {
    name: ".text-lg",
    classNames: "text-base text-lg",
    useCase: "Larger regular text — lead paragraphs, prominent values.",
    sample: "Worker schedule",
  },
  {
    name: ".text-lg .medium",
    classNames: "text-base text-medium text-lg",
    useCase: "Titles — section headers, dialog titles, card headings.",
    sample: "Worker schedule",
  },
  {
    name: ".text-2-line",
    classNames: "text-base text-2-line",
    useCase:
      "Modifier that tightens line height (1.25 instead of 1.5). Use it on text that wraps to two or more lines inside compact containers — card descriptions, two-line button or link labels, dialog titles. Combine with any size, e.g. text-base text-medium text-lg text-2-line. Don't use it for long body copy, where the default line height reads better.",
    sample: multiLine,
  },
];

function TypographyStyles() {
  return (
    <div className={styles.list}>
      {styleList.map((style) => (
        <div key={style.name} className={styles.row}>
          <div className={styles.meta}>
            <div className={styles.name}>{style.name}</div>
            <div className={styles.useCase}>{style.useCase}</div>
            <div className={styles.code}>{style.classNames}</div>
          </div>
          <div className={styles.preview}>
            <div className={style.classNames}>{style.sample}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const TOKEN_RE = /--([\w-]+):\s*([^;]+);/g;

function getTokens() {
  const tokens: { name: string; value: string }[] = [];
  for (const match of fontsRaw.matchAll(TOKEN_RE)) {
    const [, name, value] = match;
    tokens.push({ name: `--${name}`, value: value.trim() });
  }
  return tokens;
}

function previewStyle(name: string): React.CSSProperties {
  if (name.startsWith("--font-family")) return { fontFamily: `var(${name})` };
  if (name.startsWith("--font-size")) return { fontSize: `var(${name})` };
  if (name.startsWith("--font-weight"))
    return { fontWeight: `var(${name})` as never };
  if (name.startsWith("--line-height")) {
    return { lineHeight: `var(${name})`, maxWidth: 220 };
  }
  return {};
}

function FontTokens() {
  return (
    <div className={styles.tokenGrid}>
      {getTokens().map((token) => (
        <div key={token.name} className={styles.tokenCard}>
          <div className={styles.tokenPreview} style={previewStyle(token.name)}>
            {token.name.startsWith("--line-height")
              ? "The quick brown fox jumps over the lazy dog."
              : "Aa"}
          </div>
          <div className={styles.tokenInfo}>
            <div className={styles.tokenName}>{token.name}</div>
            <div className={styles.tokenValue}>{token.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const REM_PX = 16;

// Largest to smallest. Sizes are read from the --font-size-* tokens in fonts.css.
const scaleList = [
  { token: "heading-lg", className: "text-heading-lg", use: "Page headings" },
  {
    token: "heading-base",
    className: "text-heading-base",
    use: "Section headings",
  },
  {
    token: "heading-sm",
    className: "text-heading-sm",
    use: "Subsection headings",
  },
  { token: "lg", className: "text-lg", use: "Titles, lead text" },
  { token: "base", className: "text-base", use: "Default body text" },
  { token: "sm", className: "text-sm", use: "Captions, helper text, metadata" },
];

function tokenValue(name: string) {
  return fontsRaw.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim() ?? "";
}

function TypeScale() {
  return (
    <div className={styles.list}>
      {scaleList.map((item) => {
        const rem = tokenValue(`font-size-${item.token}`);
        const px = parseFloat(rem) * REM_PX;
        return (
          <div key={item.token} className={styles.row}>
            <div className={styles.meta}>
              <div className={styles.name}>{px}px</div>
              <div className={styles.useCase}>{item.use}</div>
              <div className={styles.code}>
                .{item.className} · {rem} · --font-size-{item.token}
              </div>
            </div>
            <div className={styles.preview}>
              <div className={`text-base ${item.className}`}>
                The quick brown fox jumps over
              </div>
              <div className={`text-base text-medium ${item.className}`}>
                The quick brown fox jumps over
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const meta: Meta = {
  title: "Foundations/Typography",
};
export default meta;

type Story = StoryObj;

export const Styles: Story = {
  render: () => <TypographyStyles />,
};

export const Scale: Story = {
  name: "Type scale",
  render: () => <TypeScale />,
};

export const Tokens: Story = {
  render: () => <FontTokens />,
};
