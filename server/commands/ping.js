module.exports = {
  name: 'ping',
  description: 'Check the bot\'s latency.',
  usage: '/ping',
  category: 'Utility',
  async execute(interaction, client) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    interaction.editReply(`🏓 Pong! Latency: ${latency}ms. API: ${Math.round(client.ws.ping)}ms`);
  },
};
