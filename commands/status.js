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

import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { parseFile } from 'music-metadata';
import { audio, metadataEmpty, duration, audioTitle, currentTrack } from '../backend/PlayAudio.js';
import { files, playerState } from '../backend/AudioControl.js';

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Checks what audio file is playing currently'),
  async execute(interaction, bot) {
    if (!interaction.member.voice.channel) return await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
    let audioID = currentTrack;
    audioID++;

    let audioName = files[audioID];

    if (audioName === undefined) {
      audioName = 'Playlist Finished';
    } else {
      if (metadataEmpty === false) {
        try {
          const { common } = await parseFile('music/' + audioName);
          audioName = common.title;
        } catch (error) {
          console.error(error.message);
        }
      } else {
        audioName = audioName.split('.').slice(0, -1).join('.');
      }
    }

    const controlEmbed = new EmbedBuilder()
      .setAuthor({ name: `${bot.user.username} Status`, iconURL: bot.user.avatarURL() })
      .addFields(
        { name: 'State', value: playerState },
        { name: 'Tracks', value: `${audioID}/${files.length}` },
        { name: 'Duration', value: duration }
      )
      .setColor('#0066ff');

    if (metadataEmpty === true) {
      controlEmbed.addFields(
        { name: 'Currently Playing', value: audio },
        { name: 'Up Next', value: audioName }
      );
    } else {
      controlEmbed.addFields(
        { name: 'Currently Playing', value: audioTitle },
        { name: 'Up Next', value: audioName }
      );
    }
    interaction.reply({ embeds: [controlEmbed] });
  }
};
