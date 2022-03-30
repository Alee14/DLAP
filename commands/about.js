/**************************************************************************
 *
 *  DLMP3 Bot: A Discord bot that plays local MP3 audio tracks.
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

import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed, version, MessageActionRow, MessageButton } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the bot'),
    async execute(interaction, bot) {
        const aboutEmbed = new MessageEmbed()
            .setAuthor({name:`About ${bot.user.username}`, iconURL:bot.user.avatarURL()})
            .addField('Information', 'A Discord bot that plays local MP3 audio tracks.')
            .addField('Original Creator', 'Andrew Lee (Alee#4277)')
            //.addField('Contributors', '[your name] (discord#0000)')
            //.addField('Forked by', '[your name] (discord#0000)')
            .addField('Frameworks', `Discord.JS ${version} + Voice`)
            .addField('License', 'GNU General Public License v3.0')
            .setFooter({text:'© Copyright 2020-2022 Andrew Lee. Licensed with GPL-3.0.'})
            .setColor('#0066ff')

        const srcOrig = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Original Source Code')
                    .setURL('https://github.com/Alee14/DLMP3'),
            );

        return await interaction.reply({ embeds:[aboutEmbed], components:[srcOrig] });
    },
};