// Anti-Raid: Detects mass joins and auto-bans or mutes suspected raiders
const recentJoins = new Map(); // guildId => [{userId, timestamp}]
const JOIN_WINDOW = 10 * 1000; // 10 seconds
const JOIN_THRESHOLD = 5; // 5 joins in window

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    const now = Date.now();
    const arr = recentJoins.get(member.guild.id) || [];
    arr.push({ userId: member.id, timestamp: now });
    // Remove old joins
    const filtered = arr.filter(j => now - j.timestamp < JOIN_WINDOW);
    recentJoins.set(member.guild.id, filtered);
    if (filtered.length >= JOIN_THRESHOLD) {
      // Ban all recent joiners
      for (const join of filtered) {
        try {
          await member.guild.members.ban(join.userId, { reason: 'Anti-Raid: Mass join detected' });
        } catch {}
      }
      // Log action
      const log = member.guild.systemChannel || member.guild.channels.cache.find(c => c.type === 0 && c.permissionsFor(member.guild.me).has('SendMessages'));
      if (log) log.send('🚨 Anti-Raid: Mass join detected. Recent joiners have been banned.');
      recentJoins.set(member.guild.id, []);
    }
  });
};
