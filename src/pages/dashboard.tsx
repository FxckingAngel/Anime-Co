import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';

interface Bot {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function Dashboard() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status;
  const router = useRouter();
  const [bots, setBots] = useState<Bot[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
    if (status === 'authenticated') {
      fetch('/api/bots')
        .then(res => res.json())
        .then(data => {
          setBots(data.bots || []);
        });
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated' || !session) {
    return null;
  }

  return (
    <Layout title="Dashboard | Mellie">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Image
              src={session.user?.image || '/user.svg'}
              alt={session.user?.name || 'User'}
              width={56}
              height={56}
              style={{ borderRadius: '50%', border: '2px solid #2563eb', background: '#fff' }}
            />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{session.user?.name}</div>
              <div style={{ color: '#475569', fontSize: '1.05rem' }}>{session.user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              background: '#fff',
              color: '#2563eb',
              border: '2px solid #2563eb',
              borderRadius: 8,
              padding: '0.7rem 2rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            Sign out
          </button>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', color: '#1e293b' }}>
          Your Bots
        </h1>
        {bots.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(30,41,59,0.06)',
            padding: '2.5rem 2rem',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '1.25rem', color: '#475569', marginBottom: '1.5rem' }}>
              You have no bots yet. <Link href="/dashboard/create-bot" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline' }}>Create your first bot</Link>.
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {bots.map(bot => (
              <div key={bot.id} style={{
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 2px 16px rgba(30,41,59,0.06)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>{bot.name}</div>
                <div style={{ color: '#475569', fontSize: '1.05rem' }}>{bot.description}</div>
                <div style={{ color: '#64748b', fontSize: '0.95rem', marginTop: 8 }}>Created: {new Date(bot.createdAt).toLocaleString()}</div>
                <Link href={`/dashboard/bot/${bot.id}`}
                  style={{
                    marginTop: 16,
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '0.7rem 1.5rem',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                    display: 'inline-block',
                    transition: 'background 0.2s',
                  }}
                >
                  Manage Bot
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
