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
import { inputAudio, audio } from '../AudioBackend.js'
import config from '../config.json' assert {type: 'json'}

export let integer;

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the player')
        .addIntegerOption(option =>
            option.setName('int')
                .setDescription('Input a number for the selection for the audio file.'),
        ),
    async execute(interaction, bot) {
        if (![config.botOwner].includes(interaction.user.id)) return await interaction.reply({ content: "You do not have permissions to execute this command.", ephemeral: true });
        integer = interaction.options.getInteger('int');
        await inputAudio(bot, integer);
        return await interaction.reply({ content: `Now playing: ${audio}`, ephemeral: true });
    },
};