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
import { nextAudio, playerState, previousAudio } from '../AudioBackend/AudioControl.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { readFileSync } from 'node:fs';
import { player } from '../AudioBackend/VoiceInitialization.js';
const { djRole, ownerID } = JSON.parse(readFileSync('./config.json', 'utf-8'));

export const votes = new Set();
let nextCheck;

async function commandCheck(interaction, bot) {
  if (nextCheck) {
    await interaction.reply({ content: 'Playing next music' });
    player.stop();
    return await nextAudio(bot);
  } else {
    await previousAudio(bot, interaction);
  }
}

export async function voteSkip(interaction, bot) {
  if (interaction.commandName === 'next') {
    if (nextCheck !== true) {
      // Reset the votes if the current value of nextCheck is different from the command being executed
      console.log('Vote has reset due to previous command being executed');
      votes.clear();
    }
    nextCheck = true;
  } else if (interaction.commandName === 'previous') {
    if (nextCheck !== false) {
      // Reset the votes if the current value of nextCheck is different from the command being executed
      console.log('Vote has reset due to next command being executed');
      votes.clear();
    }
    nextCheck = false;
  }

  if (interaction.options.getSubcommand() === 'vote') {
    // Get the members of the voice channel who have not voted yet
    const voiceChannel = interaction.member.voice.channel;
    const members = voiceChannel.members.filter(m => !votes.has(m.id));

    // Calculate the number of votes required to skip the audio track
    const votesRequired = Math.ceil((members.size - votes.size) / 2);

    // Check if the message author has already voted
    if (votes.has(interaction.user.id)) {
      return interaction.reply({ content: `You have already voted, wait ${votesRequired - votes.size} more vote(s) to skip the audio track`, ephemeral: true });
    }

    // Add the message author to the set of members who have voted
    votes.add(interaction.user.id);

    if (playerState === 'Playing' || playerState === 'Paused') {
      if (votes.size >= votesRequired) {
        console.log('Enough votes has passed, skipping audio file...');
        // Reset the number of votes
        votes.clear();
        // Do something to skip the audio track here (e.g. player.stop())
        await commandCheck(interaction, bot);
      } else {
        // Send a message with the number of votes needed to skip the audio track
        console.log(`${votesRequired - votes.size} more vote(s) needed to skip the audio track.`);
        await interaction.reply({ content: `${votesRequired - votes.size} more vote(s) needed to skip the audio track.` });
      }
    } else if (playerState === 'Stopped') {
      return await interaction.reply({ content: 'Cannot play next music. Player is currently stopped...', ephemeral: true });
    }
  }

  if (interaction.options.getSubcommand() === 'force') {
    if (!interaction.member.roles.cache.has(djRole) && interaction.user.id !== ownerID && !interaction.member.permission.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: 'You need a specific role to execute this command', ephemeral: true });
    console.log('Force skipping this audio track...');
    if (playerState === 'Playing' || playerState === 'Paused') {
      votes.clear();
      // Do something to skip the audio track here (e.g. player.stop())
      await commandCheck(interaction, bot);
    } else if (playerState === 'Stopped') {
      return await interaction.reply({ content: 'Cannot play next music. Player is currently stopped...', ephemeral: true });
    }
  }
}
