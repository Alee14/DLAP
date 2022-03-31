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
import { readdirSync } from 'fs'

const musicFolder = './music';

export default {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Lists the available audio tracks'),
    async execute(interaction) {
        const beats = readdirSync(musicFolder).join('\n');
        await interaction.reply(`Listing the available audio tracks...\`\`\`${beats}\`\`\``);
    },
};