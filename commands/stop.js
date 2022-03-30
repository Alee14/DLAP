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
import config from '../config.json' assert {type: 'json'}
import { stopBot } from "../AudioBackend.js";

export default {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Powers off the bot'),
    async execute(interaction, bot) {
        if (![config.botOwner].includes(interaction.user.id)) return await interaction.reply({ content: "You do not have permissions to execute this command.", ephemeral: true });
        await interaction.reply({ content: 'Powering off...', ephemeral: true})
        return await stopBot(bot, interaction);
    },
};