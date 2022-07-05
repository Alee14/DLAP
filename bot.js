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
import { Client, MessageEmbed, Collection, version } from 'discord.js'
import { voiceInit } from './AudioBackend.js'
import { readdirSync } from 'node:fs'
import config from './config.json' assert { type: 'json' }

export const bot = new Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES']});

bot.login(config.token);


/**
 * Project Ideas:
 * New queue system
 * Shuffle or "Play by order" mode
 * Audio streaming
 * Attempt to disable buttons (for control command) for regular users
 */

// Slash Command Handler

bot.commands = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  bot.commands.set(command.data.name, command);
}

bot.once('ready', async () => {
  console.log('Bot is ready!');
  console.log(`Logged in as ${bot.user.tag}!`);
  console.log(`Running on Discord.JS ${version}`)
  console.log(`Voice Channel: ${config.voiceChannel}`);
  console.log(`Status Channel: ${config.statusChannel}`);
  console.log(`Owner ID: ${config.botOwner}`);

  // Set bots' presence
  bot.user.setPresence({
    activities: [{
      name: 'some beats',
      type: 'LISTENING'
    }],
    status: 'online',
  });

  const activity = bot.presence.activities[0];
  console.log(`Updated bot presence to "${activity.name}"`);

  // Send bots' status to channel
  const readyEmbed = new MessageEmbed()
      .setAuthor({name: bot.user.username, iconURL: bot.user.avatarURL()})
      .setDescription('Starting bot...')
      .setColor('#0066ff')

  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  await statusChannel.send({embeds: [readyEmbed]});

  await voiceInit(bot);

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
      await interaction.reply({ content: `There was an error while executing this command! Share this to the bot owner!\n\nDetails:\`\`\`${e}\`\`\``, ephemeral: true });
    }
  }
});
