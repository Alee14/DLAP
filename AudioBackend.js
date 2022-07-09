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
} from '@discordjs/voice'
import { MessageEmbed } from 'discord.js'
import config from './config.json' assert {type: 'json'}
import { readdirSync, writeFile } from 'node:fs'

export const player = createAudioPlayer();
export let audio;
export let files = readdirSync('music');
let fileData;
export let audioArray;
export let currentTrack;

export let playerState;
export let isAudioStatePaused;

export async function voiceInit(bot) {
  bot.channels.fetch(config.voiceChannel).then(async channel => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.on(VoiceConnectionStatus.Ready, async () => {
        console.log('Ready to blast some beats!');
        await shufflePlaylist(bot);
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
        console.log('Destroyed the beats...');
    });

    player.on('error', error => {
        console.error(error);
        nextAudio(bot);
    });

    player.on('idle', () => {
        console.log("Beat has finished playing, now to the next beat...");
        nextAudio(bot);
    })

    return connection.subscribe(player);
  }).catch(e => { console.error(e) })
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export async function shufflePlaylist(bot) {
    console.log('Shuffling beats...');
    currentTrack = 0
    audioArray = files;
    shuffleArray(audioArray);
    console.log(audioArray);
    audio = audioArray[currentTrack]
    return await playAudio(bot);
}

export async function nextAudio(bot) {
    let totalTrack = files.length
    totalTrack--

    if (currentTrack >= totalTrack) {
        console.log('All beats in the playlist has finished, reshuffling...');
        await shufflePlaylist(bot);
    } else {
        currentTrack++
        audio = audioArray[currentTrack];
    }

 return await playAudio(bot);
}

export async function inputAudio(bot, integer) {
    let inputFiles = readdirSync('music');
    audio = inputFiles[integer];
    return await playAudio(bot);
}

export async function playAudio(bot) {
    let resource = createAudioResource('music/' + audio);

    player.play(resource);

    console.log('Now playing: ' + audio);

    playerState = "Playing"
    isAudioStatePaused = false

    audio = audio.split('.').slice(0, -1).join('.');

    if (config.txtFile === true) {
        fileData = "Now Playing: " + audio
        writeFile("./now-playing.txt", fileData, (err) => {
        if (err)
            console.log(err);
        });
    }

    const statusEmbed = new MessageEmbed()
          .addField('Now Playing', `${audio}`)
         .setColor('#0066ff')

    let statusChannel = bot.channels.cache.get(config.statusChannel);
    if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
    return await statusChannel.send({embeds: [statusEmbed]});

}

export async function destroyAudio(interaction) {
  if (config.txtFile === true) {
    fileData = "Now Playing: Nothing";
    writeFile("now-playing.txt", fileData, (err) => {
      if (err)
        console.log(err);
    });
  }

  audio = "Not Playing"
  playerState = "Stopped"
  isAudioStatePaused = true

  const connection = getVoiceConnection(interaction.guild.id);
  if (VoiceConnectionStatus.Ready) {
    player.stop();
    return connection.destroy();
  }
}

export function audioState() {
  if (isAudioStatePaused === false) {
    isAudioStatePaused = true
    playerState = "Paused"
  } else if (isAudioStatePaused === true) {
    isAudioStatePaused = false
    playerState = "Playing"
  }
}

export async function stopBot(bot, interaction) {
  const statusEmbed = new MessageEmbed()
      .setAuthor({name: bot.user.username, iconURL: bot.user.avatarURL()})
      .setDescription(`That\'s all folks! Powering down ${bot.user.username}...`)
      .setColor('#0066ff')
  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  await statusChannel.send({embeds: [statusEmbed]});

  console.log(`Powering off ${bot.user.username}...`);
  await destroyAudio(interaction);
  bot.destroy();
  return process.exit(0);
}