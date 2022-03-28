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
import { MessageEmbed } from "discord.js";
import { audio } from '../AudioBackend.js'

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays commands.'),
    async execute(interaction, bot) {
        const helpEmbed = new MessageEmbed()
            .setAuthor({name:`${bot.user.username} Help`, iconURL:bot.user.avatarURL()})
            .setDescription(`Currently playing \`${audio}\``)
            .addField('Public Commands', `/help\n/ping\n/about\n`, true)
            .addField('Bot Owner Only', `/join\n/control\n/stop\n`, true)
            .setFooter({text:'© Copyright 2020-2022 Andrew Lee. Licensed with GPL-3.0.'})
            .setColor('#0066ff')

        return interaction.reply({ embeds: [helpEmbed]});
    },
};