module.exports = {
  name: 'serverinfo',
  description: 'Get information about this server.',
  usage: '/serverinfo',
  category: 'Utility',
  async execute(interaction) {
    const { guild } = interaction;
    await interaction.reply({
      embeds: [{
        title: `${guild.name} Info`,
        thumbnail: { url: guild.iconURL({ dynamic: true, size: 256 }) },
        fields: [
          { name: 'ID', value: guild.id, inline: true },
          { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
          { name: 'Members', value: guild.memberCount.toString(), inline: true },
          { name: 'Created', value: `<t:${Math.floor(guild.createdTimestamp/1000)}:R>`, inline: true },
        ],
      }],
    });
  },
};
