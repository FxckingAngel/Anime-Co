const warns = new Map(); // guildId:userId => [reasons]

module.exports = {
  name: 'warn',
  description: 'Warn a user and log the warning.',
  usage: '/warn <user> <reason>',
  category: 'Moderation',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'User to warn',
      required: true,
    },
    {
      name: 'reason',
      type: 3, // STRING
      description: 'Reason for warning',
      required: true,
    },
  ],
  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) {
      return interaction.reply({ content: 'You do not have permission to warn members.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const key = `${interaction.guild.id}:${user.id}`;
    if (!warns.has(key)) warns.set(key, []);
    warns.get(key).push(reason);
    await interaction.reply(`⚠️ Warned ${user.tag} for: ${reason}`);
    // Log to modlog channel if exists
    const log = interaction.guild.channels.cache.find(c => c.name === 'modlog' && c.type === 0);
    if (log) log.send(`⚠️ ${user.tag} was warned by ${interaction.user.tag}: ${reason}`);
  },
};
