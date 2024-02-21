/**************************************************************************
 *
 *  DLAP Bot: A Discord bot that plays local audio tracks.
 *  (C) Copyright 2024
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
import { playAudio, updatePlaylist } from './PlayAudio.js';
import { files } from './AudioControl.js';
import i18next from '../Utilities/i18n.js';
const t = i18next.t;

function shuffleArray(array) {
  // Durstenfeld Shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
export async function orderPlaylist(bot) {
  console.log(t('musicPlayOrder'));
  updatePlaylist('reset');
  console.log(files);
  return await playAudio(bot);
}

export async function shufflePlaylist(bot) {
  console.log(t('musicShuffling'));
  shuffleArray(files);
  console.log(t('musicPlayShuffle'));
  updatePlaylist('reset');
  console.log(files);
  return await playAudio(bot);
}

export async function inputAudio(bot) {
  updatePlaylist('input');
  return await playAudio(bot);
}
