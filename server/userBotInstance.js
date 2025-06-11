require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Read credentials from environment variables
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL;
const DASHBOARD_URL = process.env.DASHBOARD_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const USER_ID = process.env.USER_ID;

if (!TOKEN || !CLIENT_ID || !CLIENT_SECRET || !OAUTH_CALLBACK_URL || !DASHBOARD_URL || !SESSION_SECRET || !USER_ID) {
  console.error('Missing required environment variables for bot instance.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Load commands and features (shared codebase)
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandsArray = [];
if (fs.existsSync(commandsPath)) {
  fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const command = require(path.join(commandsPath, file));
      client.commands.set(command.name, command);
      commandsArray.push({
        name: command.name,
        description: command.description,
        options: command.options || [],
      });
    }
  });
}

// Register commands with Discord (global)
client.once('ready', async () => {
  console.log(`[${USER_ID}] Bot logged in as ${client.user.tag}`);
  try {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commandsArray }
    );
    console.log(`[${USER_ID}] Registered global slash commands.`);
  } catch (err) {
    console.error(`[${USER_ID}] Failed to register slash commands:`, err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
    }
  }
});

// Load protection and features (shared codebase)
const protectionPath = path.join(__dirname, 'protection');
if (fs.existsSync(protectionPath)) {
  fs.readdirSync(protectionPath).forEach(file => {
    if (file.endsWith('.js')) {
      require(path.join(protectionPath, file))(client);
    }
  });
}
const featuresPath = path.join(__dirname, 'features');
if (fs.existsSync(featuresPath)) {
  fs.readdirSync(featuresPath).forEach(folder => {
    const folderPath = path.join(featuresPath, folder);
    if (fs.lstatSync(folderPath).isDirectory()) {
      fs.readdirSync(folderPath).forEach(file => {
        if (file.endsWith('.js')) {
          const feature = require(path.join(folderPath, file));
          if (typeof feature === 'function') feature(client);
        }
      });
    }
  });
}

client.login(TOKEN);
