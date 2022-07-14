/**************************************************************************
 *
 *  DLAP Bot: A Discord bot that plays local audio tracks.
 *  (C) Copyright 2022
 *  Programmed by Andrew Lee
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 ***************************************************************************/
import { Client, MessageEmbed, Collection, version } from 'discord.js';
import { voiceInit } from './AudioBackend.js';
import { readdirSync, readFileSync } from 'node:fs';
import { webServer } from './WebStream.js';
// import config from './config.json' assert { type: 'json' } Not supported by ESLint yet
const { token, statusChannel, voiceChannel, shuffle } = JSON.parse(readFileSync('./config.json'));

const bot = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

bot.login(token);

// webServer();

/**
 * Project Ideas:
 * Audio streaming
 * Metadata support
 * m3u support
 * Custom string support
 * Non repeat support
 */

// Slash Command Handler

bot.commands = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  bot.commands.set(command.data.name, command);
}

bot.once('ready', async() => {
  console.log('Bot is ready!');
  console.log(`Logged in as ${bot.user.tag}!`);
  console.log(`Running on Discord.JS ${version}`);
  console.log(`Voice Channel: ${voiceChannel}`);
  console.log(`Status Channel: ${statusChannel}`);
  console.log(`Shuffle enabled: ${shuffle}`);

  // Set bots' presence
  bot.user.setPresence({
    activities: [{
      name: 'some beats',
      type: 'LISTENING'
    }],
    status: 'online'
  });

  const activity = bot.presence.activities[0];
  console.log(`Updated bot presence to "${activity.name}"`);

  // Send bots' status to channel
  const readyEmbed = new MessageEmbed()
    .setAuthor({ name: bot.user.username, iconURL: bot.user.avatarURL() })
    .setDescription('Starting bot...')
    .setColor('#0066ff');

  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error('The status channel does not exist! Skipping.');
  await channel.send({ embeds: [readyEmbed] });

  return await voiceInit(bot);
});

bot.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = bot.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, bot);
  } catch (e) {
    console.error(e);
    if (e == null) {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: `There was an error while executing this command!\nShare this to the bot owner!\n\nDetails:\`\`\`${e}\`\`\``, ephemeral: true });
    }
  }
});
