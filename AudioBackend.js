/**************************************************************************
 * 
 *  DLMP3 Bot: A Discord bot that plays local mp3 audio tracks.
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

const { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const player = createAudioPlayer();
const fs = require('fs');
const { join } = require('node:path');
let audio;
let fileData;
let txtFile = true;
const { MessageEmbed } = require('discord.js');

module.exports = (bot, config) => {
    function voiceInit() {
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
            playAudio();
          })
      
          playAudio();
          connection.subscribe(player);
        })
      }

      function playAudio() {
        let files = fs.readdirSync(join(__dirname,'music'));
      
        while (true) {
          audio = files[Math.floor(Math.random() * files.length)];
          console.log('Searching .mp3 file...');
          if (audio.endsWith('.mp3')) {
            break;
          }
        }
      
        let resource = createAudioResource(join(__dirname, 'music/' + audio));
      
        player.play(resource);
      
        console.log('Now playing: ' + audio);
        if (txtFile === true) {
          fileData = "Now Playing: " + audio;
          fs.writeFile("./now-playing.txt", fileData, (err) => {
            if (err)
              console.log(err);
          });
        }
        const statusEmbed = new MessageEmbed()
            .addField('Now Playing', `${audio}`)
            .setColor('#0066ff')
      
        let statusChannel = bot.channels.cache.get(config.statusChannel);
        if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
        statusChannel.send({embeds: [statusEmbed]});
      
      }

      voiceInit();
}