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

import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice'
import { MessageEmbed } from 'discord.js'
import config from './config.json' assert {type: 'json'}
import fs from 'fs'

export const player = createAudioPlayer();
export let audio;
let fileData;


export function voiceInit(bot) {
  bot.channels.fetch(config.voiceChannel).then(channel => {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('Ready to blast music!');
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      console.log('Destroying beats...');
    });

    player.on('idle', () => {
      console.log("Music has finished playing, shuffling music...")
      playAudio(bot);
    })

    playAudio(bot);
    connection.subscribe(player);
  }).catch(e => { console.error("The voice channel does not exist!\\n(Have you looked at your configuration?)") })
}

export function playAudio(bot) {
  let files = fs.readdirSync('music');

  // Eventually this system will need a rework so it won't repeat the same files.

  while (true) {
    audio = files[Math.floor(Math.random() * files.length)];
    console.log('Searching .mp3 file...');
    if (audio.endsWith('.mp3')) {
      break;
    }
  }

  let resource = createAudioResource('music/' + audio);

  player.play(resource);

  console.log('Now playing: ' + audio);
  fileData = "Now Playing: " + audio;
  fs.writeFile("./now-playing.txt", fileData, (err) => {
    if (err)
      console.log(err);
  });

  const statusEmbed = new MessageEmbed()
      .addField('Now Playing', `${audio}`)
      .setColor('#0066ff')

  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  statusChannel.send({embeds: [statusEmbed]});

}