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
import { nextAudio, playerStatus, previousAudio } from '../AudioBackend/AudioControl.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { readFileSync } from 'node:fs';
import { player } from '../AudioBackend/VoiceInitialization.js';
import i18next from '../Utilities/i18n.js';

const { djRole, ownerID } = JSON.parse(readFileSync('./config.json', 'utf-8'));
const t = i18next.t;
export const votes = new Set();
let nextCheck;

async function commandCheck(interaction, bot) {
  if (nextCheck) {
    await interaction.reply({ content: t('musicNext') });
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
      votes.clear();
    }
    nextCheck = true;
  } else if (interaction.commandName === 'previous') {
    if (nextCheck !== false) {
      // Reset the votes if the current value of nextCheck is different from the command being executed
      votes.clear();
    }
    nextCheck = false;
  }

  if (interaction.options.getSubcommand() === 'vote') {
    // Get the members of the voice channel who have not voted yet
    const voiceChannel = interaction.member.voice.channel;
    const members = voiceChannel.members.filter(m => !votes.has(m.id));

    // Calculate the number of votes required to skip the audio track
    const votesRequired = Math.ceil(members.size / 2);

    // Check if the message author has already voted
    if (votes.has(interaction.user.id)) {
      return interaction.reply({ content: t('alreadyVoted', votesRequired), ephemeral: true });
    }

    if (playerStatus === 0 || playerStatus === 1) {
      // Add the message author to the set of members who have voted
      votes.add(interaction.user.id);
      if (votes.size >= votesRequired) {
        console.log(t('enoughVotes'));
        // Reset the number of votes
        votes.clear();
        // Do something to skip the audio track here (e.g. player.stop())
        await commandCheck(interaction, bot);
      } else {
        // Send a message with the number of votes needed to skip the audio track
        console.log(t('votesNeeded', { votesRequired: votesRequired - 1 }));
        await interaction.reply({ content: t('votesNeeded', { votesRequired: votesRequired - 1 }) });
      }
    } else if (playerStatus === 2) {
      return await interaction.reply({ content: t('cannotPlay'), ephemeral: true });
    }
  }

  if (interaction.options.getSubcommand() === 'force') {
    if (!interaction.member.roles.cache.has(djRole) && interaction.user.id !== ownerID && !interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: t('rolePermission'), ephemeral: true });
    console.log(t('forceSkip'));
    if (playerStatus === 0 || playerStatus === 1) {
      votes.clear();
      // Do something to skip the audio track here (e.g. player.stop())
      await commandCheck(interaction, bot);
    } else if (playerStatus === 2) {
      return await interaction.reply({ content: t('cannotPlay'), ephemeral: true });
    }
  }
}
