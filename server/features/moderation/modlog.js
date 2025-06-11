module.exports = (client) => {
  client.on('guildBanAdd', async (ban) => {
    const log = ban.guild.channels.cache.find(c => c.name === 'modlog' && c.type === 0);
    if (log) log.send(`🚫 ${ban.user.tag} was banned.`);
  });
  client.on('guildBanRemove', async (ban) => {
    const log = ban.guild.channels.cache.find(c => c.name === 'modlog' && c.type === 0);
    if (log) log.send(`✅ ${ban.user.tag} was unbanned.`);
  });
  client.on('guildMemberUpdate', async (oldM, newM) => {
    if (oldM.communicationDisabledUntilTimestamp !== newM.communicationDisabledUntilTimestamp) {
      const log = newM.guild.channels.cache.find(c => c.name === 'modlog' && c.type === 0);
      if (log) log.send(`🔇 ${newM.user.tag} was muted/unmuted.`);
    }
  });
};
