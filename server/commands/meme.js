const axios = require('axios');

module.exports = {
  name: 'meme',
  description: 'Get a random meme from Reddit.',
  usage: '/meme',
  category: 'Fun',
  async execute(interaction) {
    try {
      const res = await axios.get('https://meme-api.com/gimme');
      const meme = res.data;
      await interaction.reply({
        embeds: [{
          title: meme.title,
          image: { url: meme.url },
          url: meme.postLink,
          footer: { text: `👍 ${meme.ups} | r/${meme.subreddit}` },
        }],
      });
    } catch (err) {
      interaction.reply('Failed to fetch meme.');
    }
  },
};
