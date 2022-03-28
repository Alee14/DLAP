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
import { getVoiceConnection } from "@discordjs/voice";
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import { audio, player, playAudio } from '../AudioBackend.js'
import fs from 'fs'

let fileData;

export default {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('Controlling the music'),
    async execute(interaction, bot) {
        const controlEmbed = new MessageEmbed()
            .setAuthor({name:`${bot.user.username} Control Panel`, iconURL:bot.user.avatarURL()})
            .addField('State', 'Playing')
            .addField('Currently Playing', audio)
            //.addField('Next Music', '(a possible feature when queue system is implemented?)')
            .setColor('#0066ff')

        const controlButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('SUCCESS')
                    .setLabel('Play')
                    .setCustomId('play'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('Pause') //possible toggle button instead
                    .setCustomId('pause'),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('Skip')
                    .setCustomId('skip'),
                new MessageButton()
                    .setStyle('DANGER')
                    .setLabel('Leave')
                    .setCustomId('leave')
            );

        const collector = interaction.channel.createMessageComponentCollector();

        collector.on('collect', async i => {
            if (i.customId === 'play') {
                player.unpause();
                await i.reply({content:'Resuming music', ephemeral:true})
            }
            if (i.customId === 'pause') {
                player.pause();
                await i.reply({content:'Pausing music', ephemeral:true})
            }
            if (i.customId === 'skip') {
                player.pause();
                await i.reply({content:`Skipping \`${audio}\`...`, ephemeral:true})
                playAudio(bot);
            }
            if (i.customId === 'leave') {
                await i.reply({content:'Leaving voice channel.', ephemeral:true})
                console.log('Leaving voice channel...');
                fileData = "Now Playing: Nothing";
                fs.writeFile("now-playing.txt", fileData, (err) => {
                    if (err)
                        console.log(err);
                });
                audio = "Not Playing";
                player.stop();
                const connection = getVoiceConnection(interaction.guild.id);
                connection.destroy();
            }
        });

        return interaction.reply({embeds:[controlEmbed], components:[controlButtons]});
    },
};