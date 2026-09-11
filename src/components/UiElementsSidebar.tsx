import styles from './UiElementsSidebar.module.css';

interface UiElementsSidebarProps {
  sections: { id: string; label: string; count: number }[];
}

export function UiElementsSidebar({ sections }: UiElementsSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>UI Elements</div>
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} className={styles.navLink}>
          <span>{section.label}</span>
          <span className={styles.count}>{section.count}</span>
        </a>
      ))}
    </aside>
  );
}
