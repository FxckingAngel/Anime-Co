module.exports = {
  name: 'kick',
  description: 'Kick a user from the server.',
  usage: '/kick <user> [reason]',
  category: 'Moderation',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'User to kick',
      required: true,
    },
    {
      name: 'reason',
      type: 3, // STRING
      description: 'Reason for kick',
      required: false,
    },
  ],
  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) {
      return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided.';
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply('User not found in this server.');
    try {
      await member.kick(reason);
      interaction.reply(`Kicked ${user.tag} | Reason: ${reason}`);
    } catch (err) {
      interaction.reply('Failed to kick user.');
    }
  },
};
