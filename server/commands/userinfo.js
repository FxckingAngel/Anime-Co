module.exports = {
  name: 'userinfo',
  description: 'Get information about a user.',
  usage: '/userinfo [user]',
  category: 'Utility',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'User to get info for',
      required: false,
    },
  ],
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    await interaction.reply({
      embeds: [{
        title: `${user.username}'s Info`,
        thumbnail: { url: user.displayAvatarURL({ dynamic: true, size: 256 }) },
        fields: [
          { name: 'ID', value: user.id, inline: true },
          { name: 'Joined Server', value: member ? `<t:${Math.floor(member.joinedTimestamp/1000)}:R>` : 'N/A', inline: true },
          { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp/1000)}:R>`, inline: true },
        ],
      }],
    });
  },
};
