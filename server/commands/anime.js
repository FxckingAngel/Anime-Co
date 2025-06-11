const axios = require('axios');

module.exports = {
  name: 'anime',
  description: 'Search for anime information using the AniList API.',
  usage: '/anime <title>',
  category: 'Anime',
  options: [
    {
      name: 'title',
      type: 3, // STRING
      description: 'Anime title to search for',
      required: true,
    },
  ],
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const query = `query ($search: String) { Media(search: $search, type: ANIME) { title { romaji english } description(asHtml: false) episodes coverImage { large } siteUrl } }`;
    const variables = { search: title };
    try {
      const response = await axios.post('https://graphql.anilist.co', { query, variables });
      const anime = response.data.data.Media;
      if (!anime) return interaction.reply('No anime found.');
      const desc = anime.description ? anime.description.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '') : 'No description.';
      await interaction.reply({
        embeds: [{
          title: anime.title.english || anime.title.romaji,
          url: anime.siteUrl,
          description: desc.length > 400 ? desc.slice(0, 400) + '...' : desc,
          image: { url: anime.coverImage.large },
          fields: [
            { name: 'Episodes', value: anime.episodes ? anime.episodes.toString() : 'N/A', inline: true },
          ],
        }],
      });
    } catch (err) {
      console.error(err);
      interaction.reply('Failed to fetch anime info.');
    }
  },
};
