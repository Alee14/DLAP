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

import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus
} from '@discordjs/voice';
import { EmbedBuilder } from 'discord.js';
import { readdirSync, readFileSync, writeFile } from 'node:fs';
import { parseFile } from 'music-metadata';

// import config from './config.json' assert {type: 'json'}
const { voiceChannel, statusChannel, shuffle, txtFile } = JSON.parse(readFileSync('./config.json'));

export const player = createAudioPlayer();
export let audio;
export const files = readdirSync('music');
let fileData;

let totalTrack = files.length;
export let currentTrack;

export let playerState;
export let isAudioStatePaused;
export let metadataEmpty = false;

export let audioTitle;
export let audioArtist;
export let audioYear;
export let audioAlbum;

export async function voiceInit(bot) {
  bot.channels.fetch(voiceChannel).then(async channel => {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.on(VoiceConnectionStatus.Ready, async() => {
      console.log('Ready to blast some beats!');
      return (shuffle === true) ? await shufflePlaylist(bot) : await orderPlaylist(bot);
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      console.log('Destroyed the beats...');
    });

    player.on('error', error => {
      console.error(error);
      nextAudio(bot);
    });

    player.on('idle', () => {
      console.log('Beat has finished playing, now playing next beat...');
      nextAudio(bot);
    });

    return connection.subscribe(player);
  }).catch(e => { console.error(e); });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export async function orderPlaylist(bot) {
  console.log('Playing beats by order...');
  currentTrack = 0;
  console.log(files);
  audio = files[currentTrack];
  return await playAudio(bot);
}

export async function shufflePlaylist(bot) {
  console.log('Shuffling beats...');
  shuffleArray(files);
  console.log('Playing beats by shuffle...');
  currentTrack = 0;
  console.log(files);
  audio = files[currentTrack];
  return await playAudio(bot);
}

export async function nextAudio(bot) {
  totalTrack--;
  if (currentTrack >= totalTrack) {
    console.log('All beats in the playlist has finished, repeating beats...');
    return (shuffle === true) ? await shufflePlaylist(bot) : await orderPlaylist(bot);
  } else {
    currentTrack++;
    audio = files[currentTrack];
    return await playAudio(bot);
  }
}

export async function previousAudio(bot, interaction) {
  if (currentTrack <= 0) {
    return await interaction.reply({ content: 'You are at the beginning of the playlist, cannot go further than this', ephemeral: true });
  } else {
    await interaction.reply({ content: 'Playing previous music', ephemeral: true });
    player.stop();
    currentTrack--;
    audio = files[currentTrack];
    return await playAudio(bot);
  }
}

export async function inputAudio(bot, integer) {
  const inputFiles = readdirSync('music');
  audio = inputFiles[integer];
  return await playAudio(bot);
}

export async function playAudio(bot) {
  const resource = createAudioResource('music/' + audio);

  player.play(resource);

  console.log('Now playing: ' + audio);

  playerState = 'Playing';
  isAudioStatePaused = false;

  try {
    const { common } = await parseFile('music/' + audio);
    metadataEmpty = false;
    if (common.title && common.artist && common.year && common.album) {
      audioTitle = common.title;
      audioArtist = common.artist;
      audioYear = common.year;
      audioAlbum = common.album;
    } else {
      metadataEmpty = true;
    }
  } catch (error) {
    console.error(error.message);
  }

  audio = audio.split('.').slice(0, -1).join('.');

  if (txtFile === true) {
    fileData = 'Now Playing: ' + audio;
    writeFile('./now-playing.txt', fileData, (err) => {
      if (err) { console.log(err); }
    });
  }

  const statusEmbed = new EmbedBuilder();
  if (metadataEmpty === true) {
    statusEmbed.addFields({ name: 'Now Playing', value: audio });
    statusEmbed.setColor('#0066ff');
  } else {
    statusEmbed.setTitle('Now Playing');
    statusEmbed.addFields(
      { name: 'Title', value: audioTitle },
      { name: 'Artist', value: audioArtist },
      { name: 'Year', value: `${audioYear}` }
    );
    statusEmbed.setFooter({ text: `${audioAlbum}` });
    statusEmbed.setColor('#0066ff');
  }
  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error('The status channel does not exist! Skipping.');
  return await channel.send({ embeds: [statusEmbed] });
}

export async function destroyAudio(interaction) {
  if (txtFile === true) {
    fileData = 'Now Playing: Nothing';
    writeFile('now-playing.txt', fileData, (err) => {
      if (err) { console.log(err); }
    });
  }

  audio = 'Not Playing';
  playerState = 'Stopped';
  isAudioStatePaused = true;

  const connection = getVoiceConnection(interaction.guild.id);
  if (VoiceConnectionStatus.Ready) {
    player.stop();
    return connection.destroy();
  }
}

export function audioState() {
  if (isAudioStatePaused === false) {
    isAudioStatePaused = true;
    playerState = 'Paused';
  } else if (isAudioStatePaused === true) {
    isAudioStatePaused = false;
    playerState = 'Playing';
  }
}

export async function stopBot(bot, interaction) {
  const statusEmbed = new EmbedBuilder()
    .setAuthor({ name: bot.user.username, iconURL: bot.user.avatarURL() })
    .setDescription(`That's all folks! Powering down ${bot.user.username}...`)
    .setColor('#0066ff');
  const channel = bot.channels.cache.get(statusChannel);
  if (!channel) return console.error('The status channel does not exist! Skipping.');
  await channel.send({ embeds: [statusEmbed] });

  console.log(`Powering off ${bot.user.username}...`);
  await destroyAudio(interaction);
  bot.destroy();
  return process.exit(0);
}
