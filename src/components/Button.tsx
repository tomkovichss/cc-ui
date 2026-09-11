import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  return (
    <button type="button" className={styles[variant]} {...rest}>
      {children}
    </button>
  );
}
