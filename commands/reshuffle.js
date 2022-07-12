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

import { SlashCommandBuilder } from '@discordjs/builders';
import { player, shufflePlaylist } from '../AudioBackend.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { readFileSync } from 'node:fs';
// import config from './config.json' assert {type: 'json'}
const { shuffle } = JSON.parse(readFileSync('./config.json'));

export default {
  data: new SlashCommandBuilder()
    .setName('reshuffle')
    .setDescription('Reshuffles the playlist')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, bot) {
    async function shuffleDetected(bot) {
      await interaction.reply({ content: 'Reshuffling the playlist...', ephemeral: true });
      player.stop();
      await shufflePlaylist(bot);
    }
    return (shuffle === true) ? await shuffleDetected(bot) : await interaction.reply({ content: 'Shuffle mode is disabled, enable it on the configuration to access this command.', ephemeral: true });
  }
};
