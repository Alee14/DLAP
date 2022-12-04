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
import { createAudioResource } from '@discordjs/voice';
import { parseFile } from 'music-metadata';
import { readdirSync, readFileSync, writeFile } from 'node:fs';
import { EmbedBuilder } from 'discord.js';
import { player } from './VoiceInitialization.js';
import { audioState, files } from './AudioControl.js';
import { integer } from '../commands/play.js';
const { statusChannel, txtFile } = JSON.parse(readFileSync('./config.json', 'utf-8'));

let fileData;

export let audio;
export let currentTrack;

export let metadataEmpty;

export let audioTitle;
export let audioArtist;
export let audioYear;
export let audioAlbum;
export let duration;

const inputFiles = readdirSync('music');
export async function playAudio(bot) {
  const resource = createAudioResource('music/' + audio);
  player.play(resource);

  console.log('Now playing: ' + audio);

  audioState(0);

  const audioFile = audio;

  try {
    const { common, format } = await parseFile('music/' + audio);
    metadataEmpty = false;
    if (common.title && common.artist && common.year && common.album) {
      audioTitle = common.title;
      audioArtist = common.artist;
      audioYear = common.year;
      audioAlbum = common.album;
    } else {
      metadataEmpty = true;
    }
    duration = new Date(format.duration * 1000).toISOString().substr(11, 8);
  } catch (e) {
    console.error(e);
  }

  audio = audio.split('.').slice(0, -1).join('.');

  if (txtFile) {
    fileData = 'Now Playing: ' + audio;
    writeFile('./now-playing.txt', fileData, (err) => {
      if (err) { console.log(err); }
    });
  }

  const statusEmbed = new EmbedBuilder();
  if (metadataEmpty) {
    statusEmbed.setTitle('Now Playing');
    statusEmbed.addFields(
      { name: 'Title', value: audio },
      { name: 'Duration', value: duration }
    );
    statusEmbed.setColor('#0066ff');
  } else {
    statusEmbed.setTitle('Now Playing');
    statusEmbed.addFields(
      { name: 'Title', value: audioTitle, inline: true },
      { name: 'Artist', value: audioArtist, inline: true },
      { name: 'Year', value: `${audioYear}` },
      { name: 'Duration', value: duration }
    );
    statusEmbed.setFooter({ text: `Album: ${audioAlbum}\nFilename: ${audioFile}` });
    statusEmbed.setColor('#0066ff');
  }
  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error('The status channel does not exist! Skipping.');
  return await channel.send({ embeds: [statusEmbed] });
}

export function updatePlaylist(option) {
  switch (option) {
    case 'next':
      currentTrack++;
      audio = files[currentTrack];
      break;
    case 'back':
      currentTrack--;
      audio = files[currentTrack];
      break;
    case 'reset':
      currentTrack = 0;
      audio = files[currentTrack];
      break;
    case 'input':
      audio = inputFiles[integer];
      break;
    case 'stop':
      audio = 'Not Playing';
      break;
  }
}
