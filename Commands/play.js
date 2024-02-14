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

import { SlashCommandBuilder } from 'discord.js';
import { inputAudio } from '../AudioBackend/QueueSystem.js';
import { files, isAudioStatePaused, toggleAudioState } from '../AudioBackend/AudioControl.js';
import { audio } from '../AudioBackend/PlayAudio.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { readFileSync } from 'node:fs';
import { votes } from '../Utilities/Voting.js';
import i18next from '../Utilities/i18n.js';

const t = i18next.t;
const { djRole, ownerID } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export let integer;

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Resumes music')
    .addIntegerOption(option =>
      option.setName('int')
        .setDescription('Input a number for the selection for the audio file.')
    ),

  async execute(interaction, bot) {
    if (!interaction.member.voice.channel) return await interaction.reply({ content: t('voicePermission'), ephemeral: true });
    if (!interaction.member.roles.cache.has(djRole) && interaction.user.id !== ownerID && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: t('rolePermission'), ephemeral: true });

    integer = interaction.options.getInteger('int');
    if (integer) {
      if (integer < files.length) {
        await inputAudio(bot, integer);
        await votes.clear();
        return await interaction.reply({ content: t('nowPlayingFile', audio), ephemeral: true });
      } else {
        return await interaction.reply({ content: t('numBig', { files: files.length }), ephemeral: true });
      }
    }
    if (isAudioStatePaused) {
      toggleAudioState();
      return await interaction.reply({ content: t('resumingMusic'), ephemeral: true });
    } else {
      return await interaction.reply({ content: t('resumedAlready'), ephemeral: true });
    }
  }
};
