module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question.',
  usage: '/8ball <question>',
  category: 'Fun',
  options: [
    {
      name: 'question',
      type: 3, // STRING
      description: 'Your question',
      required: true,
    },
  ],
  async execute(interaction) {
    const responses = [
      'Yes.', 'No.', 'Maybe.', 'Definitely.', 'Absolutely not.',
      'Ask again later.', 'I don\'t know.', 'Without a doubt.', 'Very doubtful.',
    ];
    const answer = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply(`🎱 ${answer}`);
  },
};
