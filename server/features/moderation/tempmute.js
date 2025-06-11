module.exports = {
  name: 'tempmute',
  description: 'Temporarily mute a user.',
  usage: '/tempmute <user> <duration> [reason]',
  category: 'Moderation',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'User to mute',
      required: true,
    },
    {
      name: 'duration',
      type: 3, // STRING
      description: 'Mute duration (e.g. 10m, 1h)',
      required: true,
    },
    {
      name: 'reason',
      type: 3, // STRING
      description: 'Reason for mute',
      required: false,
    },
  ],
  async execute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers')) {
      return interaction.reply({ content: 'You do not have permission to mute members.', ephemeral: true });
    }
    const user = interaction.options.getUser('user');
    const durationStr = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided.';
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply('User not found in this server.');
    // Parse duration
    const match = durationStr.match(/(\d+)([smhd])/);
    if (!match) return interaction.reply('Invalid duration format. Use s/m/h/d.');
    const num = parseInt(match[1]);
    const unit = match[2];
    let ms = 0;
    if (unit === 's') ms = num * 1000;
    if (unit === 'm') ms = num * 60 * 1000;
    if (unit === 'h') ms = num * 60 * 60 * 1000;
    if (unit === 'd') ms = num * 24 * 60 * 60 * 1000;
    try {
      await member.timeout(ms, reason);
      await interaction.reply(`🔇 Muted ${user.tag} for ${durationStr}. Reason: ${reason}`);
      // Log to modlog channel if exists
      const log = interaction.guild.channels.cache.find(c => c.name === 'modlog' && c.type === 0);
      if (log) log.send(`🔇 ${user.tag} was tempmuted by ${interaction.user.tag} for ${durationStr}: ${reason}`);
    } catch {
      interaction.reply('Failed to mute user.');
    }
  },
};
