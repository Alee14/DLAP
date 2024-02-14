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
import i18next from './Utilities/i18n.js';
// import config from './config.json' assert { type: 'json' } Not supported by ESLint yet
const { token, statusChannel, voiceChannel, djRole, ownerID, shuffle, repeat, presenceActivity, activityType } = JSON.parse(readFileSync('./config.json', 'utf-8'));
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });
const t = i18next.t;
bot.login(token);

// Slash Command Handler

bot.commands = new Collection();
const commandFiles = readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./Commands/${file}`);
  bot.commands.set(command.data.name, command);
}

bot.once(Events.ClientReady, async() => {
  console.log(t('botReady'));
  console.log(t('loggedIn', { bot: bot.user.tag }));
  console.log(t('discordVersion', { version }));
  console.log(t('voiceChannel', { voiceChannel }));
  console.log(t('statusChannel', { statusChannel }));
  console.log(t('djRole', { djRole }));
  console.log(t('ownerID', { ownerID }));
  console.log(t('shuffleEnabled', { shuffle }));
  console.log(t('repeatEnabled', { repeat }));

  // Set bots' presence
  bot.user.setPresence({
    activities: [{
      name: presenceActivity,
      type: activityType
    }],
    status: 'online'
  });

  const activity = bot.presence.activities[0];
  console.log(t('presenceSet', { activity: activity.name }));

  // Send bots' status to channel
  const readyEmbed = new EmbedBuilder()
    .setAuthor({ name: bot.user.username, iconURL: bot.user.avatarURL() })
    .setDescription(t('startingBot'))
    .setColor('#0066ff');

  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error(t('statusChannelError'));
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
    await interaction.reply({ content: t('exception', { e }), ephemeral: true });
  }
});
