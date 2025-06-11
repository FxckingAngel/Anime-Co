import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Bot {
  id: string;
  owner: string;
  name: string;
  description: string;
  createdAt: string;
}

const bots: Bot[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { name, description } = req.body;
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 32) {
      return res.status(400).json({ error: 'Invalid bot name.' });
    }
    const bot: Bot = {
      id: Date.now().toString(),
      owner: session.user.email,
      name,
      description: description || '',
      createdAt: new Date().toISOString(),
    };
    bots.push(bot);
    return res.status(201).json({ bot });
  }

  if (req.method === 'GET') {
    const userEmail = session.user?.email;
    if (!userEmail) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userBots = bots.filter(b => b.owner === userEmail);
    return res.status(200).json({ bots: userBots });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
