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
import { audio, player, playAudio, destroyAudio, voiceInit, stopBot } from '../AudioBackend.js'
import config from '../config.json' assert {type: 'json'}

export let controlEmbed

export default {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('Controlling the music'),
    async execute(interaction, bot) {
        if (![config.botOwner].includes(interaction.user.id)) return await interaction.reply({ content: "You do not have permissions to execute this command.", ephemeral: true });
        controlEmbed = new MessageEmbed()
            .setAuthor({name: `${bot.user.username} Control Panel`, iconURL: bot.user.avatarURL()})
            .addField('State', 'Playing')
            .addField('Currently Playing', audio)
            //.addField('Next Music', '(a possible feature when queue system is implemented?)')
            .setColor('#0066ff')

        const controlButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('Join')
                    .setCustomId('join'),
                new MessageButton()
                    .setStyle('SUCCESS')
                    .setLabel('Play')
                    .setCustomId('play'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('Pause')
                    .setCustomId('pause'),
                new MessageButton()
                    .setStyle('DANGER')
                    .setLabel('Skip')
                    .setCustomId('skip'),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('>>')
                    .setCustomId('more'),
            );

        const controlButtons2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('<<')
                    .setCustomId('less'),
                new MessageButton()
                    .setStyle('DANGER')
                    .setLabel('Leave')
                    .setCustomId('leave'),
                new MessageButton()
                    .setStyle('DANGER')
                    .setLabel('Power Off')
                    .setCustomId('stop')
            )

        const filter = i => i.user.id === config.botOwner;

        const collector = interaction.channel.createMessageComponentCollector({filter});

        collector.on('collect', async ctlButton => {
            if (ctlButton.customId === 'join') {
                await ctlButton.reply({content:'Joining voice channel', ephemeral:true})
                voiceInit(bot);
            }
            if (ctlButton.customId === 'play') {
                await ctlButton.reply({content:'Resuming music', ephemeral:true})
                player.unpause();
            }
            if (ctlButton.customId === 'pause') {
                await ctlButton.reply({content:'Pausing music', ephemeral:true})
                player.pause();
            }
            if (ctlButton.customId === 'skip') {
                await ctlButton.reply({content:`Skipping \`${audio}\`...`, ephemeral:true})
                player.pause();
                playAudio(bot);
            }
            if (ctlButton.customId === 'more') {
                await interaction.editReply({ components: [controlButtons2] });
            }
            if (ctlButton.customId === 'less') {
                await interaction.editReply({ components: [controlButtons] });
            }
            if (ctlButton.customId === 'leave') {
                await ctlButton.reply({content:'Leaving voice channel.', ephemeral:true})
                console.log('Leaving voice channel...');
                destroyAudio(interaction);
            }
            if (ctlButton.customId === 'stop') {
                await ctlButton.reply({content:'Powering off...', ephemeral:true})
                await stopBot(bot, interaction);
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));

        return interaction.reply({embeds:[controlEmbed], components:[controlButtons]});
    },
};