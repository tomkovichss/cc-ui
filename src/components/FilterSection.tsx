import { useState } from 'react';
import { Checkbox } from './Checkbox';
import styles from './FilterSection.module.css';

interface FilterSectionProps<T extends string> {
  label: string;
  options: T[];
  optionLabel: (opt: T) => string;
  activeSet: Set<T>;
  onToggle: (opt: T) => void;
  onSetAll?: (opts: T[]) => void;
  searchable?: boolean;
}

export function FilterSection<T extends string>({
  label,
  options,
  optionLabel,
  activeSet,
  onToggle,
  onSetAll,
  searchable,
}: FilterSectionProps<T>) {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const matches = q ? options.filter((opt) => optionLabel(opt).toLowerCase().includes(q)) : options;
  const allSelected = options.length > 0 && activeSet.size === options.length;

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionLabel}>{label}</div>
        {onSetAll && (
          <button
            type="button"
            className={styles.allToggle}
            onClick={() => onSetAll(allSelected ? [] : options)}
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        )}
      </div>
      {searchable && (
        <input
          type="text"
          className={styles.search}
          placeholder={`Search ${label.toLowerCase()}…`}
          autoComplete="off"
          value={query}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      <div className={styles.optionsList}>
        {matches.length === 0 && <div className={styles.empty}>No match</div>}
        {matches.map((opt) => (
          <label key={opt} className={styles.option}>
            <Checkbox checked={activeSet.has(opt)} onChange={() => onToggle(opt)} />
            <span>{optionLabel(opt)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
