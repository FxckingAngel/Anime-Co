import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';

interface Bot {
  id: string;
  owner: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Command {
  id: string;
  name: string;
  trigger: string;
  response: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  user: string;
  action: string;
  details: Record<string, unknown>;
  timestamp: string;
}

interface UsageStats {
  [commandId: string]: {
    count: number;
    lastUsed: string;
  };
}

export default function BotDetail() {
  const sessionData = useSession();
  const status = sessionData?.status;
  const router = useRouter();
  const { id } = router.query;
  const [bot, setBot] = useState<Bot | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [usage, setUsage] = useState<UsageStats>({});
  const [error, setError] = useState('');
  const [cmdName, setCmdName] = useState('');
  const [cmdTrigger, setCmdTrigger] = useState('');
  const [cmdResponse, setCmdResponse] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTrigger, setEditTrigger] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [botEditMode, setBotEditMode] = useState(false);
  const [botEditName, setBotEditName] = useState('');
  const [botEditDescription, setBotEditDescription] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetch(`/api/bots/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error);
          else {
            setBot(data.bot);
            setCommands(data.commands);
            setAudit(data.audit || []);
            setUsage(data.usage || {});
            setBotEditName(data.bot.name);
            setBotEditDescription(data.bot.description);
          }
                  });
    }
  }, [status, id]);

  if (status === 'loading' || status === 'unauthenticated') return null;
  if (!bot) return <Layout title="Bot | Mellie"><></></Layout>;
  if (error) {
    return (
      <Layout title="Bot | Mellie">
        <div style={{ color: '#dc2626', textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem' }}>{error}</div>
      </Layout>
    );
  }

  // Only render the UI, all logic is in useEffect and handlers below
  return (
    <Layout title={`Manage Bot | ${bot.name} | Mellie`}>
      <div style={{ maxWidth: 900, margin: '3rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(30,41,59,0.06)', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {botEditMode ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const res = await fetch(`/api/bots/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: botEditName, description: botEditDescription }),
              });
              if (res.ok) {
                const data = await res.json();
                setBot(data.bot);
                setBotEditMode(false);
                fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', flex: 1 }}>
              <input
                type="text"
                value={botEditName}
                onChange={e => setBotEditName(e.target.value)}
                required
                minLength={3}
                maxLength={32}
                style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: 6, padding: '0.5rem' }}
              />
              <textarea
                value={botEditDescription}
                onChange={e => setBotEditDescription(e.target.value)}
                rows={2}
                maxLength={200}
                style={{ fontSize: '1.05rem', color: '#475569', border: '1px solid #cbd5e1', borderRadius: 6, padding: '0.5rem' }}
              />
              <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
                <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '1.05rem' }}>Save</button>
                <button type="button" onClick={() => setBotEditMode(false)} style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '1.05rem' }}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>{bot.name}</h1>
              <button
                onClick={() => setBotEditMode(true)}
                style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer' }}
              >
                Edit Bot
              </button>
            </>
          )}
          <button
            onClick={async () => {
              if (!confirm('Are you sure you want to delete this bot and all its commands?')) return;
              await fetch(`/api/bots/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deleteBot: true }),
              });
              router.push('/dashboard');
            }}
            style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 700, fontSize: '1.05rem', marginLeft: 12 }}
          >
            Delete Bot
          </button>
        </div>
        <div style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '2rem' }}>{bot.description}</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2563eb', marginBottom: '1rem' }}>Add Command</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch(`/api/bots/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: cmdName, trigger: cmdTrigger, response: cmdResponse }),
          });
          if (res.ok) {
            const data = await res.json();
            setCommands([...commands, data.command]);
            setCmdName('');
            setCmdTrigger('');
            setCmdResponse('');
            fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
          }
        }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Command Name"
            value={cmdName}
            onChange={e => setCmdName(e.target.value)}
            required
            minLength={2}
            maxLength={32}
            style={{ flex: 1, minWidth: 120, padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1.05rem' }}
          />
          <input
            type="text"
            placeholder="Trigger (e.g. !hello)"
            value={cmdTrigger}
            onChange={e => setCmdTrigger(e.target.value)}
            required
            minLength={1}
            maxLength={32}
            style={{ flex: 1, minWidth: 120, padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1.05rem' }}
          />
          <input
            type="text"
            placeholder="Response"
            value={cmdResponse}
            onChange={e => setCmdResponse(e.target.value)}
            required
            minLength={1}
            maxLength={200}
            style={{ flex: 2, minWidth: 180, padding: '0.7rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1.05rem' }}
          />
          <button
            type="submit"
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 2rem',
              fontWeight: 700,
              fontSize: '1.05rem',
            }}
          >
            Add Command
          </button>
        </form>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#2563eb', marginBottom: '1rem' }}>Commands & Usage</h2>
        {commands.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '1.1rem' }}>No commands yet. Add your first command above.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {commands.map(cmd => (
              <div key={cmd.id} style={{
                background: '#f1f5f9',
                borderRadius: 8,
                padding: '1rem 1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                position: 'relative',
              }}>
                {editId === cmd.id ? (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch(`/api/bots/${id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ commandId: editId, name: editName, trigger: editTrigger, response: editResponse }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setCommands(commands.map(c => c.id === editId ? data.command : c));
                      setEditId(null);
                      setEditName('');
                      setEditTrigger('');
                      setEditResponse('');
                      fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
                    }
                  }} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      required
                      minLength={2}
                      maxLength={32}
                      style={{ flex: 1, minWidth: 80, padding: '0.5rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1.05rem' }}
                    />
                    <input
                      type="text"
                      value={editTrigger}
                      onChange={e => setEditTrigger(e.target.value)}
                      required
                      minLength={1}
                      maxLength={32}
                      style={{ flex: 1, minWidth: 80, padding: '0.5rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1.05rem' }}
                    />
                    <input
                      type="text"
                      value={editResponse}
                      onChange={e => setEditResponse(e.target.value)}
                      required
                      minLength={1}
                      maxLength={200}
                      style={{ flex: 2, minWidth: 120, padding: '0.5rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '1.05rem' }}
                    />
                    <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '1.05rem' }}>Save</button>
                    <button type="button" onClick={() => setEditId(null)} style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, fontSize: '1.05rem' }}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}>{cmd.name} <span style={{ color: '#64748b', fontWeight: 400, fontSize: '0.98rem' }}>({cmd.trigger})</span></div>
                    <div style={{ color: '#334155', fontSize: '1.05rem' }}>{cmd.response}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Created: {new Date(cmd.createdAt).toLocaleString()}</div>
                    <div style={{ color: '#64748b', fontSize: '0.98rem', marginTop: 4 }}>
                      Usage: <b>{usage[cmd.id]?.count || 0}</b> times
                      {usage[cmd.id]?.lastUsed && (
                        <span> &middot; Last used: {new Date(usage[cmd.id].lastUsed).toLocaleString()}</span>
                      )}
                      <button onClick={async () => {
                        await fetch(`/api/bots/${id}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ simulateUsage: true, commandId: cmd.id }),
                        });
                        fetch(`/api/bots/${id}`).then(res => res.json()).then(data => setUsage(data.usage || {}));
                      }} style={{ marginLeft: 16, background: '#e0e7ef', color: '#2563eb', border: 'none', borderRadius: 6, padding: '0.2rem 0.8rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' }}>Simulate Usage</button>
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => {
                        setEditId(cmd.id);
                        setEditName(cmd.name);
                        setEditTrigger(cmd.trigger);
                        setEditResponse(cmd.response);
                      }} style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={async () => {
                        await fetch(`/api/bots/${id}`, {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ commandId: cmd.id }),
                        });
                        setCommands(commands.filter(c => c.id !== cmd.id));
                        fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
                      }} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginTop: '2.5rem', marginBottom: '1rem' }}>Activity Log</h2>
        {audit.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '1.05rem' }}>No activity yet.</div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {audit.slice().reverse().map(log => (
              <li key={log.id} style={{ background: '#f8fafc', borderRadius: 6, padding: '0.7rem 1rem', color: '#334155', fontSize: '1.05rem', display: 'flex', flexDirection: 'column' }}>
                <span><b>{log.user}</b> &mdash; {log.action}</span>
                <span style={{ color: '#94a3b8', fontSize: '0.98rem' }}>{new Date(log.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
