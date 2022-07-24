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
import { stopBot } from '../AudioBackend.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';

export default {
  data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription('Powers off the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, bot) {
    await interaction.reply({ content: 'Powering off...', ephemeral: true });
    return await stopBot(bot, interaction);
  }
};
