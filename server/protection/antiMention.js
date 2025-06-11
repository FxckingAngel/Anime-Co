// Anti-Mention: Blocks messages with excessive mentions
const MENTION_THRESHOLD = 5;

module.exports = (client) => {
  client.on('messageCreate', async (msg) => {
    if (!msg.guild || msg.author.bot) return;
    const mentionCount = msg.mentions.users.size + msg.mentions.roles.size;
    if (mentionCount >= MENTION_THRESHOLD) {
      // Allow whitelisted roles (e.g., mods/admins)
      if (msg.member.permissions.has('ManageMessages')) return;
      try {
        await msg.delete();
        msg.channel.send(`🚫 ${msg.author}, too many mentions!`);
      } catch {}
    }
  });
};
