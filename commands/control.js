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
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import { audio } from '../AudioBackend.js'


export default {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('Controlling the music'),
    async execute(interaction, bot) {
        const controlEmbed = new MessageEmbed()
            .setAuthor({name:`${bot.user.username} Control Panel`, iconURL:bot.user.avatarURL()})
            .addField('Currently Playing', audio)
            .addField('Next Music', '(a possible feature?)')
            .setColor('#0066ff')

        const controlButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('Pause')
                    .setCustomId('soon')
            );

        return interaction.reply({embeds:[controlEmbed], components:[controlButtons]});
    },
};