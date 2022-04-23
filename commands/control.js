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

import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js'
import { audio, player, destroyAudio, voiceInit, stopBot, searchAudio, playerState, audioState } from '../AudioBackend.js'
import config from '../config.json' assert {type: 'json'}

export let controlEmbed
export let controlButtons
export let controlButtons2

let runOnce = false

export default {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('Controlling the music'),
    async execute(interaction, bot) {
        if (![config.botOwner].includes(interaction.user.id)) return await interaction.reply({ content: "You do not have permissions to execute this command.", ephemeral: true });
        if (runOnce === true) return await interaction.reply({content:'You already executed this command', ephemeral:true})

        controlEmbed = new MessageEmbed()
            .setAuthor({name: `${bot.user.username} Control Panel`, iconURL: bot.user.avatarURL()})
            .addField('State', playerState)
            .addField('Currently Playing', audio)
            //.addField('Next Music', '(a possible feature when queue system is implemented?)')
            .setColor('#0066ff')

        controlButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('SUCCESS')
                    .setLabel('Join')
                    .setCustomId('join')
                    .setDisabled(true),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('Play')
                    .setCustomId('play')
                    .setDisabled(true),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('Pause')
                    .setCustomId('pause'),
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setLabel('Skip')
                    .setCustomId('skip'),
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('>>')
                    .setCustomId('next'),
            );

        controlButtons2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('<<')
                    .setCustomId('back'),
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
                await ctlButton.reply({content:'Joining voice channel', ephemeral:true});
                controlButtons.components[0].setDisabled(true);
                controlButtons.components[1].setDisabled(true);
                controlButtons.components[2].setDisabled(false);
                controlButtons.components[3].setDisabled(false);
                controlButtons2.components[1].setDisabled(false);
                await interaction.editReply({components:[controlButtons]});
                return await voiceInit(bot);
            }
            if (ctlButton.customId === 'play') {
                controlButtons.components[2].setDisabled(false);
                controlButtons.components[1].setDisabled(true);
                await interaction.editReply({components:[controlButtons]});
                await ctlButton.reply({content:'Resuming music', ephemeral:true});
                audioState();
                return player.unpause();
            }
            if (ctlButton.customId === 'pause') {
                controlButtons.components[2].setDisabled(true);
                controlButtons.components[1].setDisabled(false);
                await interaction.editReply({components:[controlButtons]});
                await ctlButton.reply({content:'Pausing music', ephemeral:true});
                audioState();
                return player.pause();
            }
            if (ctlButton.customId === 'skip') {
                await ctlButton.reply({content:`Skipping ${audio}`, ephemeral:true});
                player.stop();
                return await searchAudio(bot, interaction);
            }
            if (ctlButton.customId === 'next') {
                return await interaction.editReply({ components: [controlButtons2] }).then(ctlButton.deferUpdate());
            }
            if (ctlButton.customId === 'back') {
                return await interaction.editReply({ components: [controlButtons] }).then(ctlButton.deferUpdate());
            }
            if (ctlButton.customId === 'leave') {
                await ctlButton.reply({content:'Leaving voice channel', ephemeral:true});
                console.log('Leaving voice channel...');
                controlButtons.components[0].setDisabled(false);
                controlButtons.components[1].setDisabled(true);
                controlButtons.components[2].setDisabled(true);
                controlButtons.components[3].setDisabled(true);
                controlButtons2.components[1].setDisabled(true);
                await interaction.editReply({components:[controlButtons2]});
                return await destroyAudio(interaction);
            }
            if (ctlButton.customId === 'stop') {
                await ctlButton.reply({content:`Powering off ${bot.user.username}...`, ephemeral:true});
                await interaction.deleteReply();
                return await stopBot(bot, interaction);
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        runOnce = true
        return await interaction.reply({embeds:[controlEmbed], components:[controlButtons]});
    },
};