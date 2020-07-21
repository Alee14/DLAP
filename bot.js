/**************************************************************************
 * 
 *  DLMP3 Bot: A Discord bot that plays local mp3 audio tracks.
 *  (C) Copyright 2020
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
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json');
let dispatcher;
let audio;

client.login(config.token);

function playAudio() {
  const channel = client.channels.cache.get(config.voiceChannel);
  if (!channel) return console.error('The channel does not exist!');
  
  channel.join().then(connection => {
    let files = fs.readdirSync('./music');

    while (true) {
      audio = files[Math.floor(Math.random() * files.length)];
      console.log('Searching .mp3 file...');
      if (audio.endsWith('.mp3')) {
        break;
      }
    }

    dispatcher = connection.play('./music/' + audio);
    
    dispatcher.on('start', () => {
      console.log('Now playing ' + audio);
      let statusChannel = client.channels.cache.get(config.statusChannel);
      if (!statusChannel) return console.error('The channel does not exist!');
      statusChannel.send('**Music Bot Status:**\nNow playing ' + audio);
    });
    
    dispatcher.on('error', console.error);

    dispatcher.on('finish', () => {
      playAudio();
    });
    
  }).catch(e => {
    console.error(e);
  });
  
}
client.on('ready', () => {
  console.log('Bot is ready!');
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Prefix: ${config.prefix}`);
  console.log(`Owner ID: ${config.botOwner}`);
  console.log(`Voice Channel: ${config.voiceChannel}`);
  console.log(`Status Channel: ${config.statusChannel}\n`);

  client.user.setStatus('invisible');
  console.log('Connected to the voice channel.');
  playAudio();
});

client.on('message', async msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if (!msg.content.startsWith(config.prefix)) return;
  let command = msg.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  // Public allowed commands

  if (command == 'help') {
    const helpEmbed = new Discord.MessageEmbed()
    .addField('Bot Help', `${config.prefix}help\n${config.prefix}ping\n${config.prefix}git\n${config.prefix}about`)
    .setFooter('© Copyright 2020, Andrew Lee. Licensed with GPL-3.0.')
    .setColor('#0066ff')

    msg.channel.send(helpEmbed);
  }

  if (command == 'ping') {
    msg.reply('Pong!');
  }

  if (command == 'git') {
    msg.reply('This is the source code of this project.\nhttps://github.com/Alee14/PJ2020-Discord-Bot');
  }
  
  if (command == 'about') {
    msg.channel.send('This bot was created by Andrew Lee. Written in Discord.JS and licensed with GPL-3.0.');
  }

  if (![config.botOwner].includes(msg.author.id)) return;

  // Bot owner exclusive

  if (command == 'join') {
    msg.reply('Joining voice channel.');
    console.log('Connected to the voice channel.');
    playAudio();
  }

  if (command == 'skip') {
    msg.reply('Skipping `' + audio + '`...');
    dispatcher.pause();
    dispatcher = null;
    playAudio();
  }

  if (command == 'leave') {
    const channel = client.channels.cache.get(config.voiceChannel);
    if (!channel) return console.error('The channel does not exist!');
    msg.reply('Leaving voice channel.');
    console.log('Leaving voice channel.');
    dispatcher.destroy();
    channel.leave();
  }

  if (command == 'stop') {
    await msg.reply('Powering off...');
    console.log('Powering off...');
    client.destroy();
    process.exit(0);
  }

});