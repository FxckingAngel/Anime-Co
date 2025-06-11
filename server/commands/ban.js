module.exports = {
  name: 'ban',
  description: 'Ban a user from the server.',
  usage: '/ban <user> [reason]',
  category: 'Moderation',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'User to ban',
      required: true,
    },
    {
      name: 'reason',
      type: 3, // STRING
      description: 'Reason for ban',
      required: false,
    },
  ],
  async execute(interaction) {
    if (!interaction.member.permissions.has('BanMembers')) {
      return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided.';
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply('User not found in this server.');
    try {
      await member.ban({ reason });
      interaction.reply(`Banned ${user.tag} | Reason: ${reason}`);
    } catch (err) {
      interaction.reply('Failed to ban user.');
    }
  },
};
