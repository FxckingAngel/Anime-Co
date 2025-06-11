import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

export default function Login() {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <Layout title="Login | BotGhost Pro">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '2rem' }}>Sign in to BotGhost Pro</h1>
        {providers && providers.discord && (
          <button
            onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
            style={{
              background: '#5865F2',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '1rem 2.5rem',
              fontSize: '1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(88,101,242,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="14" fill="#fff"/>
              <path d="M19.5 8.5C18.328 7.953 17.078 7.573 15.75 7.38C15.57 7.41 15.44 7.52 15.39 7.7C15.23 8.19 15.06 8.79 14.91 9.3C13.77 9.13 12.65 9.13 11.53 9.3C11.38 8.79 11.21 8.19 11.05 7.7C11 7.52 10.87 7.41 10.69 7.38C9.36 7.57 8.11 7.95 6.94 8.5C6.89 8.52 6.85 8.56 6.83 8.62C4.73 11.77 4.09 14.85 4.32 17.89C4.33 18.03 4.43 18.15 4.56 18.18C6.2 18.54 7.77 18.81 9.33 18.97C9.39 18.98 9.45 18.95 9.48 18.9C9.7 18.57 9.9 18.23 10.08 17.89C10.13 17.8 10.09 17.68 9.99 17.63C9.62 17.44 9.27 17.23 8.94 17.01C8.87 16.96 8.86 16.85 8.93 16.8C9.09 16.68 9.25 16.56 9.41 16.44C9.45 16.41 9.5 16.41 9.54 16.43C11.13 17.19 12.87 17.19 14.46 16.43C14.5 16.41 14.55 16.41 14.59 16.44C14.75 16.56 14.91 16.68 15.07 16.8C15.14 16.85 15.13 16.96 15.06 17.01C14.73 17.23 14.38 17.44 14.01 17.63C13.91 17.68 13.87 17.8 13.92 17.89C14.1 18.23 14.3 18.57 14.52 18.9C14.55 18.95 14.61 18.98 14.67 18.97C16.23 18.81 17.8 18.54 19.44 18.18C19.57 18.15 19.67 18.03 19.68 17.89C19.91 14.85 19.27 11.77 17.17 8.62C17.15 8.56 17.11 8.52 17.06 8.5H19.5Z" fill="#5865F2"/>
            </svg>
            Sign in with Discord
          </button>
        )}
      </div>
    </Layout>
  );
}
