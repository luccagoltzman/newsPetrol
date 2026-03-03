import { useState } from 'react';
import { fetchInstagramPosts } from '@/services/instagram.service';
import type { InstagramPost } from '@/types/instagram.types';
import { Layout } from '@/components/Layout/Layout';
import { UsernameInput } from '@/components/UsernameInput/UsernameInput';
import { PostCard } from '@/components/PostCard/PostCard';
import { Spinner } from '@/components/Spinner/Spinner';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import styles from './NewsPage.module.css';

export function NewsPage(): JSX.Element {
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const loadPosts = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await fetchInstagramPosts({ username: username.trim() });
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className={styles.section}>
        <div className={styles.toolbar}>
          <UsernameInput
            value={username}
            onUsernameChange={setUsername}
            onSubmit={loadPosts}
            loading={loading}
            placeholder="Usuário do Instagram"
          />
        </div>

        {loading && (
          <div className={styles.loading}>
            <Spinner size="lg" />
            <span>Carregando posts...</span>
          </div>
        )}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={loadPosts} />
        )}

        {!loading && !error && !hasSearched && (
          <EmptyState message="Digite um usuário do Instagram e clique em Buscar para ver os posts." />
        )}

        {!loading && !error && hasSearched && posts.length === 0 && (
          <EmptyState message="Nenhum post encontrado para este usuário." />
        )}

        {!loading && !error && posts.length > 0 && (
          <ul className={styles.list} aria-label="Lista de posts">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </Layout>
  );
}
