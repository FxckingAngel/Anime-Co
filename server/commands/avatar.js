module.exports = {
  name: 'avatar',
  description: 'Get the avatar of a user.',
  usage: '/avatar [user]',
  category: 'Utility',
  options: [
    {
      name: 'user',
      type: 6, // USER
      description: 'User to get avatar for',
      required: false,
    },
  ],
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply({
      embeds: [{
        title: `${user.username}'s Avatar`,
        image: { url: user.displayAvatarURL({ dynamic: true, size: 512 }) },
      }],
    });
  },
};
