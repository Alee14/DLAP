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
import { shufflePlaylist } from '../AudioBackend/QueueSystem.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { readFileSync } from 'node:fs';
import { audioState } from '../AudioBackend/AudioControl.js';
// import config from './config.json' assert {type: 'json'}
const { shuffle, djRole, ownerID } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export default {
  data: new SlashCommandBuilder()
    .setName('reshuffle')
    .setDescription('Reshuffles the playlist'),
  async execute(interaction, bot) {
    if (!interaction.member.voice.channel) return await interaction.reply({ content: 'You need to be in a voice channel to use this command.', ephemeral: true });
    if (!interaction.member.roles.cache.has(djRole) && interaction.user.id !== ownerID && !interaction.member.permission.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: 'You need a specific role to execute this command', ephemeral: true });

    async function shuffleDetected(bot) {
      await interaction.reply({ content: 'Reshuffling the playlist...', ephemeral: true });
      await audioState(2);
      await shufflePlaylist(bot);
    }
    return (shuffle) ? await shuffleDetected(bot) : await interaction.reply({ content: 'Shuffle mode is disabled, enable it in the configuration file to access this command.', ephemeral: true });
  }
};
