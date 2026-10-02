import type { ReactNode } from 'react';
import styles from './FieldLabel.module.css';

interface FieldLabelProps {
  children: ReactNode;
  /** Pass the id of the control this labels to render a real `<label htmlFor>`. */
  htmlFor?: string;
  className?: string;
}

export function FieldLabel({ children, htmlFor, className }: FieldLabelProps) {
  const classes = `${styles.label} ${className ?? ''}`.trim();
  if (htmlFor) {
    return (
      <label className={classes} htmlFor={htmlFor}>
        {children}
      </label>
    );
  }
  return <span className={classes}>{children}</span>;
}
