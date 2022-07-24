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
import { isAudioStatePaused, inputAudio, audio, audioState, player, files } from '../AudioBackend.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';

export let integer;

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Resumes music')
    .addIntegerOption(option =>
      option.setName('int')
        .setDescription('Input a number for the selection for the audio file.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, bot) {
    integer = interaction.options.getInteger('int');
    if (integer) {
      if (integer < files.length) {
        await inputAudio(bot, integer);
        return await interaction.reply({ content: `Now playing: ${audio}`, ephemeral: true });
      } else {
        return await interaction.reply({ content: 'Number is too big, choose a number that\'s less than ' + files.length + '.', ephemeral: true });
      }
    }
    if (isAudioStatePaused === true) {
      audioState();
      player.unpause();
      return await interaction.reply({ content: 'Resuming music', ephemeral: true });
    } else {
      return await interaction.reply({ content: 'Music is already playing', ephemeral: true });
    }
  }
};
