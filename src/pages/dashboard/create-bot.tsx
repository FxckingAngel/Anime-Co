import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';

export default function CreateBot() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status === 'loading') return null;
  if (!session) {
    router.replace('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/bots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create bot.');
    }
  };

  return (
    <Layout title="Create Bot | Mellie">
      <div style={{ maxWidth: 520, margin: '4rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(30,41,59,0.06)', padding: '2.5rem 2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1e293b' }}>Create a New Bot</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ fontWeight: 600, color: '#2563eb' }}>Bot Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              minLength={3}
              maxLength={32}
              style={{ width: '100%', padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 6, fontSize: '1.1rem' }}
            />
          </div>
          <div>
            <label htmlFor="description" style={{ fontWeight: 600, color: '#2563eb' }}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
              style={{ width: '100%', padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', marginTop: 6, fontSize: '1.1rem' }}
            />
          </div>
          {error && <div style={{ color: '#dc2626', fontWeight: 600 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.9rem 2.5rem',
              fontWeight: 700,
              fontSize: '1.15rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: 10,
            }}
          >
            {loading ? 'Creating...' : 'Create Bot'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
