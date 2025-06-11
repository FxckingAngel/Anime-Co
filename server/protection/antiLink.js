// Anti-Link: Deletes messages with unwanted links
const LINK_REGEX = /https?:\/\//i;

module.exports = (client) => {
  client.on('messageCreate', async (msg) => {
    if (!msg.guild || msg.author.bot) return;
    if (LINK_REGEX.test(msg.content)) {
      // Allow whitelisted roles (e.g., mods/admins)
      if (msg.member.permissions.has('ManageMessages')) return;
      try {
        await msg.delete();
        msg.channel.send({ content: `🚫 ${msg.author}, links are not allowed!`, ephemeral: true });
      } catch {}
    }
  });
};
