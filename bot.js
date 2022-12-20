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
import { Client, Events, GatewayIntentBits, EmbedBuilder, Collection, version, InteractionType } from 'discord.js';
import { voiceInit } from './AudioBackend/VoiceInitialization.js';
import { readdirSync, readFileSync } from 'node:fs';
// import config from './config.json' assert { type: 'json' } Not supported by ESLint yet
const { token, statusChannel, voiceChannel, djRole, ownerID, shuffle, repeat, presenceActivity, activityType } = JSON.parse(readFileSync('./config.json', 'utf-8'));
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
bot.login(token);

// Slash Command Handler

bot.commands = new Collection();
const commandFiles = readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./Commands/${file}`);
  bot.commands.set(command.data.name, command);
}

bot.once(Events.ClientReady, async() => {
  console.log('Bot is ready!');
  console.log(`Logged in as ${bot.user.tag}!`);
  console.log(`Running on Discord.JS ${version}`);
  console.log(`Voice Channel: ${voiceChannel}`);
  console.log(`Status Channel: ${statusChannel}`);
  console.log(`DJ Role: ${djRole}`);
  console.log(`Owner ID: ${ownerID}`);
  console.log(`Shuffle Enabled: ${shuffle}`);
  console.log(`Repeat Enabled: ${repeat}`);

  // Set bots' presence
  bot.user.setPresence({
    activities: [{
      name: presenceActivity,
      type: activityType
    }],
    status: 'online'
  });

  const activity = bot.presence.activities[0];
  console.log(`Updated bot presence to "${activity.name}"`);

  // Send bots' status to channel
  const readyEmbed = new EmbedBuilder()
    .setAuthor({ name: bot.user.username, iconURL: bot.user.avatarURL() })
    .setDescription('Starting bot...')
    .setColor('#0066ff');

  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error('The status channel does not exist! Skipping.');
  await channel.send({ embeds: [readyEmbed] });

  return await voiceInit(bot);
});

bot.on(Events.InteractionCreate, async interaction => {
  if (interaction.type === !InteractionType.ApplicationCommand) return;
  if (!interaction.isChatInputCommand()) return;
  const command = bot.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, bot);
  } catch (e) {
    console.error(e);
    await interaction.reply({ content: `There was an error while executing this command...\nShare this to the bot owner or report it to the git repository in \`/about\`\n\nDetails:\`\`\`${e}\`\`\``, ephemeral: true });
  }
});
