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
import { toggleAudioState, isAudioStatePaused, playerStatus } from '../AudioBackend/AudioControl.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { readFileSync } from 'node:fs';
import i18next from '../Utilities/i18n.js';
const t = i18next.t;
const { djRole, ownerID } = JSON.parse(readFileSync('./config.json', 'utf-8'));
export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses music'),
  async execute(interaction, bot) {
    if (!interaction.member.voice.channel) return await interaction.reply({ content: t('voicePermission'), ephemeral: true });
    if (!interaction.member.roles.cache.has(djRole) && interaction.user.id !== ownerID && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: t('rolePermission'), ephemeral: true });

    if (playerStatus === 2) {
      return await interaction.reply({ content: t('alreadyLeave'), ephemeral: true });
    } else {
      if (!isAudioStatePaused) {
        toggleAudioState();
        return await interaction.reply({ content: t('pausingMusic'), ephemeral: true });
      } else {
        return await interaction.reply({ content: t('pausedAlready'), ephemeral: true });
      }
    }
  }
};
