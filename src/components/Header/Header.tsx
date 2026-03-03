import styles from './Header.module.css';

export function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>Instagram Posts</h1>
      <p className={styles.tagline}>
        Busque posts e vídeos por usuário
      </p>
    </header>
  );
}
