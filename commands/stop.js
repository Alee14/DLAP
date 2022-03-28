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
import config from '../config.json' assert {type: 'json'}
import { destroyAudio } from "../AudioBackend.js";

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Powers off the bot'),
    async execute(interaction, bot) {
        await interaction.reply('Powering off...')

        const statusEmbed = new MessageEmbed()
            .setAuthor({name:bot.user.username, iconURL:bot.user.avatarURL()})
            .setDescription(`That\'s all folks! Powering down ${bot.user.username}...`)
            .setColor('#0066ff')
        let statusChannel = bot.channels.cache.get(config.statusChannel);
        if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
        await statusChannel.send({ embeds: [statusEmbed] });

        console.log('Powering off...');
        destroyAudio(interaction);
        bot.destroy();
        process.exit(0);
    },
};