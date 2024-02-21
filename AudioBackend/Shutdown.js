/**************************************************************************
 *
 *  DLAP Bot: A Discord bot that plays local audio tracks.
 *  (C) Copyright 2024
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
import { EmbedBuilder } from 'discord.js';
import { player } from './VoiceInitialization.js';
import { updatePlaylist } from './PlayAudio.js';
import { audioState } from './AudioControl.js';
import { readFileSync, writeFile } from 'node:fs';
import { getVoiceConnection, VoiceConnectionStatus } from '@discordjs/voice';
import i18next from '../Utilities/i18n.js';

const { statusChannel, txtFile } = JSON.parse(readFileSync('./config.json', 'utf-8'));
let fileData;
const t = i18next.t;

export async function destroyAudio(interaction) {
  if (txtFile) {
    fileData = t('txtNothing');
    writeFile('now-playing.txt', fileData, (err) => {
      if (err) { console.log(err); }
    });
  }

  updatePlaylist('stop');
  audioState(2);

  const connection = getVoiceConnection(interaction.guild.id);
  if (VoiceConnectionStatus.Ready) {
    player.stop();
    return connection.destroy();
  }
}
export async function stopBot(bot, interaction) {
  const statusEmbed = new EmbedBuilder()
    .setAuthor({ name: bot.user.username, iconURL: bot.user.avatarURL() })
    .setDescription(t('statusShutdown', { bot: bot.user.username }))
    .setColor('#0066ff');
  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error(t('statusChannelError'));
  await channel.send({ embeds: [statusEmbed] });

  console.log(t('powerOff', { bot: bot.user.username }));
  await destroyAudio(interaction);
  await bot.destroy();
  return process.exit(0);
}
