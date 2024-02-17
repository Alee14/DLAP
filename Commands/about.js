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

import { EmbedBuilder, version, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
// import npmPackage from '../package.json' assert { type:'json' }
import i18next from '../Utilities/i18n.js';
import { readFileSync } from 'node:fs';
const npmPackage = JSON.parse(readFileSync('./package.json', 'utf-8'));
const t = i18next.t;
export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Information about the bot'),
  async execute(interaction, bot) {
    const aboutEmbed = new EmbedBuilder()
      .setAuthor({ name: t('aboutBot', { bot: bot.user.username }), iconURL: bot.user.avatarURL() })
      .addFields(
        { name: t('aboutInfo'), value: t('aboutInfoValue') },
        { name: t('aboutBotVersion'), value: `DLAP ${npmPackage.version}` },
        { name: t('aboutCreator'), value: 'Andrew Lee (alee)' }, // Do not remove this since I created this :)
        { name: t('aboutContributors'), value: 'Victor Moraes (Vicktor#7232) (Improving README)\nParlance Translation Team' },
        // { name: t('aboutForked'), value: '[your name] (username)' },
        { name: t('aboutFrameworks'), value: `Discord.JS ${version}\nmusic-metadata\ni18next` },
        { name: t('aboutLicense'), value: 'GNU General Public License v3.0' }
      )
      .setFooter({ text: '© Copyright 2020-2024 Andrew Lee' })
      .setColor('#0066ff');

    const srcOrig = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel(t('aboutSrc'))
          .setURL('https://github.com/Alee14/DLAP')
      );

    return await interaction.reply({ embeds: [aboutEmbed], components: [srcOrig] });
  }
};
