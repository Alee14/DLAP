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

import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { parseFile } from 'music-metadata';
import { audio, metadataEmpty, duration, audioTitle, currentTrack } from '../AudioBackend/PlayAudio.js';
import { files, playerState, playerStatus } from '../AudioBackend/AudioControl.js';
import { votes } from '../Utilities/Voting.js';
import i18next from '../Utilities/i18n.js';

const t = i18next.t;
export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Checks what audio file is playing currently'),
  async execute(interaction, bot) {
    if (!interaction.member.voice.channel) return await interaction.reply({ content: t('voicePermission'), ephemeral: true });
    let audioID = currentTrack;
    audioID++;

    let audioName;

    // Get the members of the voice channel who have not voted yet
    const voiceChannel = interaction.member.voice.channel;
    const members = voiceChannel.members.filter(m => !votes.has(m.id) && !m.user.bot);

    // Calculate the number of votes required to skip the audio track
    const votesRequired = Math.ceil(members.size / 2);

    if (audioID >= files.length) {
      audioName = t('playlistDone');
    } else {
      audioName = files[audioID];
      if (!metadataEmpty) {
        try {
          const { common } = await parseFile('music/' + audioName);
          audioName = common.title ? common.title : audioName.split('.').slice(0, -1).join('.');
        } catch (error) {
          console.error(error.message);
        }
      } else {
        audioName = audioName.split('.').slice(0, -1).join('.');
      }
    }

    const controlEmbed = new EmbedBuilder()
      .setAuthor({ name: t('statusTitle', { bot: bot.user.username }), iconURL: bot.user.avatarURL() })
      .addFields(
        { name: t('statusState'), value: `${playerState}` },
        { name: t('statusTracks'), value: `${audioID}/${files.length}` },
        { name: t('musicDuration'), value: `${duration}` },
        { name: t('statusVotesNeeded'), value: `${votesRequired}` }
      )
      .setColor('#0066ff');

    if (playerStatus === 0 || playerStatus === 1) {
      if (metadataEmpty) {
        controlEmbed.addFields(
          { name: t('currentlyPlaying'), value: `${audio}` },
          { name: t('upNext'), value: `${audioName}` }
        );
      } else {
        controlEmbed.addFields(
          { name: t('currentlyPlaying'), value: `${audioTitle}` },
          { name: t('upNext'), value: `${audioName}` }
        );
      }
    }
    interaction.reply({ embeds: [controlEmbed] });
  }
};
