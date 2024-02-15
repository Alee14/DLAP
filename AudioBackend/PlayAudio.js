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
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { player } from './VoiceInitialization.js';
import { audioState, files } from './AudioControl.js';
import { integer } from '../Commands/play.js';
import i18next from '../Utilities/i18n.js';

const { statusChannel, txtFile } = JSON.parse(readFileSync('./config.json', 'utf-8'));
const t = i18next.t;

let fileData;

export let audio;
export let currentTrack;

export let metadataEmpty;

export let audioTitle;
export let audioArtist;
export let audioYear;
export let audioAlbum;
export let audioPicture;
export let duration;

const inputFiles = readdirSync('music');
export async function playAudio(bot) {
  const resource = createAudioResource('music/' + audio);
  player.play(resource);

  console.log(t('nowPlayingFile', { audio }));

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
      if (common.picture) {
        // Convert base64 image to a buffer
        const imageBuffer = Buffer.from(common.picture[0].data, 'base64');

        // Create a new attachment using the buffer
        audioPicture = new AttachmentBuilder(imageBuffer, { name: 'albumArt.png' });
      }
    } else {
      metadataEmpty = true;
    }
    duration = new Date(format.duration * 1000).toISOString().slice(11, 19);
  } catch (e) {
    console.error(e);
  }

  audio = audio.split('.').slice(0, -1).join('.');

  if (txtFile) {
    fileData = t('nowPlayingFile', { audio });
    writeFile('./now-playing.txt', fileData, (err) => {
      if (err) { console.log(err); }
    });
  }

  const statusEmbed = new EmbedBuilder();

  if (metadataEmpty) {
    statusEmbed.setTitle(t('nowPlaying'));
    statusEmbed.addFields(
      { name: t('musicTitle'), value: `${audio}` },
      { name: t('musicDuration'), value: `${duration}` }
    );
    statusEmbed.setColor('#0066ff');
  } else {
    statusEmbed.setTitle(t('nowPlaying'));
    statusEmbed.addFields(
      { name: t('musicTitle'), value: `${audioTitle}`, inline: true },
      { name: t('musicArtist'), value: `${audioArtist}`, inline: true },
      { name: t('musicYear'), value: `${audioYear}` },
      { name: t('musicDuration'), value: `${duration}` }
    );

    if (audioPicture) {
      statusEmbed.setThumbnail('attachment://albumArt.png');
    }

    statusEmbed.setFooter({ text: t('playerFooter', { audioAlbum, audioFile }) });
    statusEmbed.setColor('#0066ff');
  }
  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error(t('statusChannelError'));
  if (audioPicture) {
    return await channel.send({ embeds: [statusEmbed], files: [audioPicture] });
  } else {
    return await channel.send({ embeds: [statusEmbed] });
  }
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
      audio = t('notPlaying');
      break;
  }
}
