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

function formatAuditAction(log: AuditLog) {
  switch (log.action) {
    case 'add_command':
      return `Added command "${(log.details as any).command?.name ?? ''}"`;
    case 'edit_command':
      return `Edited command "${(log.details as any).after?.name ?? ''}"`;
    case 'delete_command':
      return `Deleted command "${(log.details as any).command?.name ?? ''}"`;
    case 'edit_bot':
      return `Edited bot details`;
    case 'delete_bot':
      return `Deleted bot`;
    default:
      return log.action;
  }
}

export default function BotDetail() {
  const { status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [bot, setBot] = useState<Bot | null>(null);
  const [commands, setCommands] = useState<Command[]>([]);
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [usage, setUsage] = useState<UsageStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cmdName, setCmdName] = useState('');
  const [cmdTrigger, setCmdTrigger] = useState('');
  const [cmdResponse, setCmdResponse] = useState('');
  const [cmdLoading, setCmdLoading] = useState(false);
  const [cmdError, setCmdError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTrigger, setEditTrigger] = useState('');
  const [editResponse, setEditResponse] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [botDeleteLoading, setBotDeleteLoading] = useState(false);
  const [botEditMode, setBotEditMode] = useState(false);
  const [botEditName, setBotEditName] = useState('');
  const [botEditDescription, setBotEditDescription] = useState('');
  const [botEditLoading, setBotEditLoading] = useState(false);
  const [botEditError, setBotEditError] = useState('');
  const [botEditSuccess, setBotEditSuccess] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
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
          setLoading(false);
        });
    }
  }, [status, id, router]);

  if (status === 'loading' || loading) {
    return (
      <Layout title="Bot | BotGhost Pro">
        <div style={{ textAlign: 'center', marginTop: '5rem', fontSize: '1.5rem' }}>Loading bot...</div>
      </Layout>
    );
  }
  if (error) {
    return (
      <Layout title="Bot | BotGhost Pro">
        <div style={{ color: '#dc2626', textAlign: 'center', marginTop: '5rem', fontSize: '1.2rem' }}>{error}</div>
      </Layout>
    );
  }
  if (!bot) return <Layout title="Bot | BotGhost Pro"><></></Layout>;

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCmdLoading(true);
    setCmdError('');
    const res = await fetch(`/api/bots/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: cmdName, trigger: cmdTrigger, response: cmdResponse }),
    });
    setCmdLoading(false);
    if (res.ok) {
      const data = await res.json();
      setCommands([...commands, data.command]);
      setCmdName('');
      setCmdTrigger('');
      setCmdResponse('');
      fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
    } else {
      const data = await res.json();
      setCmdError(data.error || 'Failed to add command.');
    }
  };

  const handleEditCommand = (cmd: Command) => {
    setEditId(cmd.id);
    setEditName(cmd.name);
    setEditTrigger(cmd.trigger);
    setEditResponse(cmd.response);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setCmdLoading(true);
    setCmdError('');
    const res = await fetch(`/api/bots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commandId: editId, name: editName, trigger: editTrigger, response: editResponse }),
    });
    setCmdLoading(false);
    if (res.ok) {
      const data = await res.json();
      setCommands(commands.map(cmd => cmd.id === editId ? data.command : cmd));
      setEditId(null);
      setEditName('');
      setEditTrigger('');
      setEditResponse('');
      fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
    } else {
      const data = await res.json();
      setCmdError(data.error || 'Failed to update command.');
    }
  };

  const handleDeleteCommand = async (commandId: string) => {
    setDeleteLoading(true);
    await fetch(`/api/bots/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commandId }),
    });
    setCommands(commands.filter(cmd => cmd.id !== commandId));
    setDeleteLoading(false);
    fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
  };

  const handleDeleteBot = async () => {
    if (!confirm('Are you sure you want to delete this bot and all its commands?')) return;
    setBotDeleteLoading(true);
    await fetch(`/api/bots/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteBot: true }),
    });
    setBotDeleteLoading(false);
    router.push('/dashboard');
  };

  const handleBotEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBotEditLoading(true);
    setBotEditError('');
    setBotEditSuccess('');
    const res = await fetch(`/api/bots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: botEditName, description: botEditDescription }),
    });
    setBotEditLoading(false);
    if (res.ok) {
      const data = await res.json();
      setBot(data.bot);
      setBotEditSuccess('Bot updated successfully.');
      setTimeout(() => setBotEditSuccess(''), 2000);
      setBotEditMode(false);
      fetch(`/api/bots/${id}`).then(res => res.json()).then(data => { setAudit(data.audit || []); setUsage(data.usage || {}); });
    } else {
      const data = await res.json();
      setBotEditError(data.error || 'Failed to update bot.');
    }
  };

  // Simulate command usage for analytics demo
  const simulateUsage = async (commandId: string) => {
    await fetch(`/api/bots/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulateUsage: true, commandId }),
    });
    fetch(`/api/bots/${id}`).then(res => res.json()).then(data => setUsage(data.usage || {}));
  };

return (
  <Layout title={`Manage Bot | ${bot.name} | Mellie`}>
    {/* Your page content goes here */}
    <div>Hello, bot dashboard</div>
  </Layout>
);

}
