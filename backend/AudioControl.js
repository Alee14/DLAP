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
import { readdirSync, readFileSync } from 'node:fs';
import { shufflePlaylist, orderPlaylist } from './QueueSystem.js';
import { playAudio, currentTrack, updatePlaylist } from './PlayAudio.js';
import { player } from './VoiceInitialization.js';

const { shuffle } = JSON.parse(readFileSync('./config.json', 'utf-8'));
export const files = readdirSync('music');
export let playerState;
export let isAudioStatePaused;

let totalTrack = files.length;

export async function nextAudio(bot) {
  totalTrack--;
  if (currentTrack >= totalTrack) {
    console.log('All beats in the playlist has finished, repeating beats...');
    totalTrack = files.length;
    return (shuffle === true) ? await shufflePlaylist(bot) : await orderPlaylist(bot);
  } else {
    updatePlaylist('next');
    return await playAudio(bot);
  }
}

export async function previousAudio(bot, interaction) {
  totalTrack++;
  if (currentTrack <= 0) {
    return await interaction.reply({ content: 'You are at the beginning of the playlist, cannot go further than this', ephemeral: true });
  } else {
    await interaction.reply({ content: 'Playing previous music', ephemeral: true });
    player.stop();
    updatePlaylist('back');
    return await playAudio(bot);
  }
}

export function toggleAudioState() {
  if (isAudioStatePaused === true) {
    audioState(0);
  } else {
    audioState(1);
  }
}

export function audioState(state) {
  switch (state) {
    case 0:
      playerState = 'Playing';
      isAudioStatePaused = false;
      player.unpause();
      break;
    case 1:
      playerState = 'Paused';
      isAudioStatePaused = true;
      player.pause();
      break;
    case 2:
      playerState = 'Stopped';
      isAudioStatePaused = true;
      break;
  }
}
