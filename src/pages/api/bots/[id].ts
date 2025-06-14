import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

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

const bots: Bot[] = [];
const commands: Record<string, Command[]> = {};
const auditLogs: Record<string, AuditLog[]> = {};
const usageStats: Record<string, UsageStats> = {};

function logAudit(botId: string, user: string, action: string, details: Record<string, unknown>) {
  if (!auditLogs[botId]) auditLogs[botId] = [];
  auditLogs[botId].push({
    id: Date.now().toString(),
    user,
    action,
    details,
    timestamp: new Date().toISOString(),
  });
}

function logUsage(botId: string, commandId: string) {
  if (!usageStats[botId]) usageStats[botId] = {};
  if (!usageStats[botId][commandId]) usageStats[botId][commandId] = { count: 0, lastUsed: '' };
  usageStats[botId][commandId].count += 1;
  usageStats[botId][commandId].lastUsed = new Date().toISOString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const userEmail = session.user?.email;
  if (!userEmail) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const bot = bots.find(b => b.id === id && b.owner === userEmail);
  if (!bot) {
    return res.status(404).json({ error: 'Bot not found' });
  }

  // Simulate command usage (for analytics demo)
  if (req.method === 'POST' && req.body.simulateUsage) {
    const { commandId } = req.body;
    if (!commandId) return res.status(400).json({ error: 'Missing commandId.' });
    logUsage(bot.id, commandId);
    return res.status(200).json({ success: true });
  }

  // Command editing and deletion
  if (req.method === 'PATCH') {
    const { commandId, name, trigger, response } = req.body;
    if (!commandId) return res.status(400).json({ error: 'Missing commandId.' });
    const botCommands = commands[bot.id] || [];
    const cmd = botCommands.find((c: Command) => c.id === commandId);
    if (!cmd) return res.status(404).json({ error: 'Command not found.' });
    const oldCmd = { ...cmd };
    if (name) cmd.name = name;
    if (trigger) cmd.trigger = trigger;
    if (response) cmd.response = response;
    logAudit(bot.id, session.user.email, 'edit_command', { before: oldCmd, after: cmd });
    return res.status(200).json({ command: cmd });
  }

  if (req.method === 'DELETE') {
    const { commandId, deleteBot } = req.body;
    if (deleteBot) {
      logAudit(bot.id, session.user.email, 'delete_bot', { bot });
      const botIndex = bots.findIndex(b => b.id === id);
      if (botIndex !== -1) bots.splice(botIndex, 1);
      delete commands[bot.id];
      delete auditLogs[bot.id];
      delete usageStats[bot.id];
      return res.status(200).json({ success: true });
    }
    if (!commandId) return res.status(400).json({ error: 'Missing commandId.' });
    const cmd = (commands[bot.id] || []).find((c: Command) => c.id === commandId);
    commands[bot.id] = (commands[bot.id] || []).filter((c: Command) => c.id !== commandId);
    logAudit(bot.id, session.user.email, 'delete_command', { command: cmd });
    if (usageStats[bot.id]) delete usageStats[bot.id][commandId];
    return res.status(200).json({ success: true });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      bot,
      commands: commands[bot.id] || [],
      audit: auditLogs[bot.id] || [],
      usage: usageStats[bot.id] || {},
    });
  }

  if (req.method === 'POST') {
    // Add a new command to the bot
    const { name, trigger, response } = req.body;
    if (!name || !trigger || !response) {
      return res.status(400).json({ error: 'Missing command fields.' });
    }
    if (!commands[bot.id]) commands[bot.id] = [];
    const command: Command = {
      id: Date.now().toString(),
      name,
      trigger,
      response,
      createdAt: new Date().toISOString(),
    };
    commands[bot.id].push(command);
    logAudit(bot.id, session.user.email, 'add_command', { command });
    return res.status(201).json({ command });
  }

  if (req.method === 'PUT') {
    // Update bot details
    const { name, description } = req.body;
    if (name && (typeof name !== 'string' || name.length < 3 || name.length > 32)) {
      return res.status(400).json({ error: 'Invalid bot name.' });
    }
    const before = { name: bot.name, description: bot.description };
    if (name) bot.name = name;
    if (description) bot.description = description;
    logAudit(bot.id, session.user.email, 'edit_bot', { before, after: { name: bot.name, description: bot.description } });
    return res.status(200).json({ bot });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
