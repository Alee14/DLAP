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

import { SlashCommandBuilder } from 'discord.js';
import { voiceInit } from '../AudioBackend/VoiceInitialization.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { readFileSync } from 'node:fs';
import { getVoiceConnection } from '@discordjs/voice';
import i18next from '../Utilities/i18n.js';
const { djRole, ownerID } = JSON.parse(readFileSync('./config.json', 'utf-8'));
const t = i18next.t;
export default {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins voice chat'),
  async execute(interaction, bot) {
    if (!interaction.member.voice.channel) return await interaction.reply({ content: t('voicePermission'), ephemeral: true });
    if (!interaction.member.roles.cache.has(djRole) && interaction.user.id !== ownerID && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: t('rolePermission'), ephemeral: true });

    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
      return await interaction.reply({ content: t('alreadyJoin'), ephemeral: true });
    }
    await interaction.reply({ content: t('joinVoice'), ephemeral: true });
    return await voiceInit(bot);
  }
};
