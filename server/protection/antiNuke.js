// Anti-Nuke: Prevents mass channel/role deletions
const recentDeletions = new Map(); // userId => [timestamp]
const NUKE_WINDOW = 10000; // 10 seconds
const NUKE_THRESHOLD = 3; // 3 deletions in window

module.exports = (client) => {
  client.on('channelDelete', async (channel) => {
    if (!channel.guild) return;
    const audit = await channel.guild.fetchAuditLogs({ type: 12, limit: 1 }); // CHANNEL_DELETE
    const entry = audit.entries.first();
    if (!entry) return;
    const userId = entry.executorId;
    const now = Date.now();
    const arr = recentDeletions.get(userId) || [];
    arr.push(now);
    const filtered = arr.filter(t => now - t < NUKE_WINDOW);
    recentDeletions.set(userId, filtered);
    if (filtered.length >= NUKE_THRESHOLD) {
      // Ban user
      try {
        await channel.guild.members.ban(userId, { reason: 'Anti-Nuke: Mass channel deletions' });
        const log = channel.guild.systemChannel || channel.guild.channels.cache.find(c => c.type === 0 && c.permissionsFor(channel.guild.me).has('SendMessages'));
        if (log) log.send(`🚨 Anti-Nuke: ${entry.executor.tag} has been banned for mass channel deletions.`);
      } catch {}
      recentDeletions.set(userId, []);
    }
  });
  client.on('roleDelete', async (role) => {
    if (!role.guild) return;
    const audit = await role.guild.fetchAuditLogs({ type: 32, limit: 1 }); // ROLE_DELETE
    const entry = audit.entries.first();
    if (!entry) return;
    const userId = entry.executorId;
    const now = Date.now();
    const arr = recentDeletions.get(userId) || [];
    arr.push(now);
    const filtered = arr.filter(t => now - t < NUKE_WINDOW);
    recentDeletions.set(userId, filtered);
    if (filtered.length >= NUKE_THRESHOLD) {
      // Ban user
      try {
        await role.guild.members.ban(userId, { reason: 'Anti-Nuke: Mass role deletions' });
        const log = role.guild.systemChannel || role.guild.channels.cache.find(c => c.type === 0 && c.permissionsFor(role.guild.me).has('SendMessages'));
        if (log) log.send(`🚨 Anti-Nuke: ${entry.executor.tag} has been banned for mass role deletions.`);
      } catch {}
      recentDeletions.set(userId, []);
    }
  });
};
