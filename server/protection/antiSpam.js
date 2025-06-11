// Anti-Spam: Detects repeated messages and mutes/kicks spammers
const userMessages = new Map(); // userId => [{content, timestamp}]
const SPAM_WINDOW = 7000; // 7 seconds
const SPAM_THRESHOLD = 5; // 5 messages in window

module.exports = (client) => {
  client.on('messageCreate', async (msg) => {
    if (!msg.guild || msg.author.bot) return;
    const now = Date.now();
    const arr = userMessages.get(msg.author.id) || [];
    arr.push({ content: msg.content, timestamp: now });
    // Remove old messages
    const filtered = arr.filter(m => now - m.timestamp < SPAM_WINDOW);
    userMessages.set(msg.author.id, filtered);
    if (filtered.length >= SPAM_THRESHOLD) {
      // Mute user (timeout for 10m)
      try {
        await msg.member.timeout(10 * 60 * 1000, 'Anti-Spam: Spamming messages');
        msg.channel.send(`🔇 ${msg.author} has been muted for spamming.`);
      } catch {}
      userMessages.set(msg.author.id, []);
    }
  });
};
