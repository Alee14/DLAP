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
import { readFileSync } from 'node:fs';
const npmPackage = JSON.parse(readFileSync('./package.json'));

export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Information about the bot'),
  async execute(interaction, bot) {
    const aboutEmbed = new EmbedBuilder()
      .setAuthor({ name: `About ${bot.user.username}`, iconURL: bot.user.avatarURL() })
      .addFields(
        { name: 'Information', value: 'A Discord bot that plays local audio tracks.' },
        { name: 'Version', value: `DLAP ${npmPackage.version}` },
        { name: 'Original Creator', value: 'Andrew Lee (Alee#4277)' }, // Do not remove this since I created this :)
        // { name: 'Contributors', value: '[your name] (discord#0000)' },
        // { name: 'Forked by', value: '[your name] (discord#0000)' },
        { name: 'Frameworks', value: `Discord.JS ${version} + Voice` },
        { name: 'License', value: 'GNU General Public License v3.0' }
      )
      .setFooter({ text: '© Copyright 2020-2022 Andrew Lee' })
      .setColor('#0066ff');

    const srcOrig = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('Original Source Code')
          .setURL('https://github.com/Alee14/DLAP')
      );

    return await interaction.reply({ embeds: [aboutEmbed], components: [srcOrig] });
  }
};
