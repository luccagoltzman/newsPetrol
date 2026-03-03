import type { FormHTMLAttributes } from 'react';
import { Button } from '@/components/Button/Button';
import styles from './UsernameInput.module.css';

export interface UsernameInputProps extends FormHTMLAttributes<HTMLFormElement> {
  value: string;
  onUsernameChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
}

export function UsernameInput({
  value,
  onUsernameChange,
  onSubmit,
  loading = false,
  placeholder = 'Ex: keke',
  ...rest
}: UsernameInputProps): JSX.Element {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Buscar posts por usuário"
      {...rest}
    >
      <input
        id="instagram-username"
        name="username"
        type="text"
        value={value}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        aria-label="Nome de usuário do Instagram"
        disabled={loading}
        autoComplete="username"
      />
      <Button type="submit" disabled={loading || !value.trim()}>
        {loading ? 'Buscando…' : 'Buscar'}
      </Button>
    </form>
  );
}
