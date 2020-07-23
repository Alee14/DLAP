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
const bot = new Discord.Client();
const config = require('./config.json');
let dispatcher;
let audio;
let voiceChannel;

bot.login(config.token);

function playAudio() {
  voiceChannel = bot.channels.cache.get(config.voiceChannel);
  if (!voiceChannel) return console.error('The voice channel does not exist!\n(Have you looked at your configuration?)');
  
  voiceChannel.join().then(connection => {
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

      const statusEmbed = new Discord.MessageEmbed()
      .addField('Now Playing', `${audio}`)
      .setColor('#0066ff')

      let statusChannel = bot.channels.cache.get(config.statusChannel);
      if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
      statusChannel.send(statusEmbed);
    });
    
    dispatcher.on('error', console.error);

    dispatcher.on('finish', () => {
      console.log('Music has finished playing.');
      playAudio();
    });
    
  }).catch(e => {
    console.error(e);
  });
  
}

bot.on('ready', () => {
  console.log('Bot is ready!');
  console.log(`Logged in as ${bot.user.tag}!`);
  console.log(`Prefix: ${config.prefix}`);
  console.log(`Owner ID: ${config.botOwner}`);
  console.log(`Voice Channel: ${config.voiceChannel}`);
  console.log(`Status Channel: ${config.statusChannel}\n`);

  bot.user.setStatus('online');
  console.log('Connected to the voice channel.');
  playAudio();
});

bot.on('message', async msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if (!msg.content.startsWith(config.prefix)) return;
  let command = msg.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  // Public allowed commands

  if (command == 'help') {
    if (!msg.guild.member(bot.user).hasPermission('EMBED_LINKS')) return msg.reply('**ERROR: This bot doesn\'t have the permission to send embed links please enable them to use the full help.**');
    const helpEmbed = new Discord.MessageEmbed()
    .setAuthor(`${bot.user.username} Help`)
    .setDescription(`Currently playing \`${audio}\`.`)
    .addField(`Public Commands`, `${config.prefix}help\n${config.prefix}ping\n${config.prefix}git\n${config.prefix}playing\n${config.prefix}about\n`)
    .setFooter('© Copyright 2020 Andrew Lee. Licensed with GPL-3.0.')
    .setColor('#0066ff')

    msg.channel.send(helpEmbed);
  }

  if (command == 'ping') {
    msg.reply('Pong!');
  }

  if (command == 'git') {
    msg.reply('This is the source code of this project.\nhttps://github.com/Alee14/DLMP3');
  }

  if (command == 'playing') {
    msg.channel.send('Currently playing `' + audio + '`.');
  }
  
  if (command == 'about') {
    msg.channel.send('The bot code was created by Andrew Lee (Alee#4277). Written in Discord.JS and licensed with GPL-3.0.');
  }

  if (![config.botOwner].includes(msg.author.id)) return;

  // Bot owner exclusive

  if (command == 'join') {
    msg.reply('Joining voice channel.');
    console.log('Connected to the voice channel.');
    playAudio();
  }

  if (command == 'resume') {
    msg.reply('Resuming music.');
    dispatcher.resume();
  }

  if (command == 'pause') {
    msg.reply('Pausing music.');
    dispatcher.pause();
  }

  if (command == 'skip') {
    msg.reply('Skipping `' + audio + '`...');
    dispatcher.pause();
    dispatcher = null;
    playAudio();
  }

  if (command == 'leave') {
    voiceChannel = bot.channels.cache.get(config.voiceChannel);
    if (!voiceChannel) return console.error('The voice channel does not exist!\n(Have you looked at your configuration?)');
    msg.reply('Leaving voice channel.');
    console.log('Leaving voice channel.');
    dispatcher.destroy();
    voiceChannel.leave();
  }

  if (command == 'stop') {
    await msg.reply('Powering off...');
    const statusEmbed = new Discord.MessageEmbed()
    .setTitle('That\'s all folks!')
    .setColor('#0066ff')
    let statusChannel = bot.channels.cache.get(config.statusChannel);
      if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
    statusChannel.send(statusEmbed);
    console.log('Powering off...');
    dispatcher.destroy();
    bot.destroy();
    process.exit(0);
  }

});
