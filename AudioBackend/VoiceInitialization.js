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
import { readFileSync } from 'node:fs';
import { createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import { nextAudio } from './AudioControl.js';
import { shufflePlaylist, orderPlaylist } from './QueueSystem.js';

const { voiceChannel, shuffle } = JSON.parse(readFileSync('./config.json', 'utf-8'));
export const player = createAudioPlayer();
export async function voiceInit(bot) {
  bot.channels.fetch(voiceChannel).then(async channel => {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.on(VoiceConnectionStatus.Connecting, () => {
      console.log(`Connecting to ${channel.name}...`);
    });

    connection.on(VoiceConnectionStatus.Ready, async() => {
      console.log('Ready to blast some beats!');
      return (shuffle) ? await shufflePlaylist(bot) : await orderPlaylist(bot);
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      console.log('Destroyed the beats...');
    });

    player.on('error', error => {
      console.error(error);
      nextAudio(bot);
    });

    player.on('idle', () => {
      console.log('Beat has finished playing, now playing next beat...');
      nextAudio(bot);
    });

    return connection.subscribe(player);
  }).catch(e => { console.error(e); });
}
