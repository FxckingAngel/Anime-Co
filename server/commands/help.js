module.exports = {
  name: 'help',
  description: 'List all available commands.',
  usage: '/help',
  category: 'General',
  async execute(interaction, client) {
    const cmds = client.commands.map(cmd => `• **/${cmd.name}**: ${cmd.description}`).join('\n');
    await interaction.reply({
      embeds: [{
        title: 'Anime-Co Commands',
        description: cmds,
        color: 0xff6f61,
      }],
      ephemeral: true,
    });
  },
};
