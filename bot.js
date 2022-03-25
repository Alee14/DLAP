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
const Discord = require('discord.js');
const fs = require('fs');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const bot = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES']});
const config = require('./config.json');
const player = createAudioPlayer();
let audio;
let voiceChannel;
let fileData;
let resource;

bot.login(config.token);

function joinChannel(channelID) {
  bot.channels.fetch(channelID).then(channel => {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.subscribe(player);

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('The connection has entered the Ready state - ready to play audio!');
    });

    playAudio();
  })
}

function playAudio() {
  let files = fs.readdirSync('./music');

  while (true) {
    audio = files[Math.floor(Math.random() * files.length)];
    console.log('Searching .mp3 file...');
    if (audio.endsWith('.mp3')) {
      break;
    }
  }

  resource = createAudioResource('./music/' + audio);
  
  player.play(resource);

  console.log('Now playing ' + audio);
  fileData = "Now Playing: " + audio;
  fs.writeFile("now-playing.txt", fileData, (err) => { 
  if (err) 
  console.log(err); 
  }); 
  const statusEmbed = new Discord.MessageEmbed()
  .addField('Now Playing', `${audio}`)
  .setColor('#0066ff')

  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  statusChannel.send({ embeds: [statusEmbed]});

}

bot.on('ready', () => {
  console.log('Bot is ready!');
  console.log(`Logged in as ${bot.user.tag}!`);
  console.log(`Running on Discord.JS ${Discord.version}`)
  console.log(`Prefix: ${config.prefix}`);
  console.log(`Owner ID: ${config.botOwner}`);
  console.log(`Voice Channel: ${config.voiceChannel}`);
  console.log(`Status Channel: ${config.statusChannel}\n`);

  // Set bots' presence

  bot.user.setPresence({
    activities: [{
      name: `Music | ${config.prefix}help`,
      type: 'LISTENING'
    }],
    status: 'online',
  });

  const activity = bot.presence.activities[0];
  console.log(`Updated bot presence to "${activity.name}"`);

  // Send bots' status to channel
  const readyEmbed = new Discord.MessageEmbed()
  .setAuthor({name:`${bot.user.username}`, url:bot.user.avatarURL()})
  .setDescription('Starting bot...')
  .setColor('#0066ff')

  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  statusChannel.send({ embeds: [readyEmbed]});

  joinChannel(config.voiceChannel)

});

bot.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  if (!msg.guild) return;
  if (!msg.content.startsWith(config.prefix)) return;
  let command = msg.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  // Public allowed commands

  if (command == 'help') {
    const helpEmbed = new Discord.MessageEmbed()
    .setAuthor({name:`${bot.user.username} Help`, iconURL:bot.user.avatarURL()})
    .setDescription(`Currently playing \`${audio}\`.`)
    .addField('Public Commands', `${config.prefix}help\n${config.prefix}ping\n${config.prefix}git\n${config.prefix}playing\n${config.prefix}about\n`, true)
    .addField('Bot Owner Only', `${config.prefix}join\n${config.prefix}resume\n${config.prefix}pause\n${config.prefix}skip\n${config.prefix}leave\n${config.prefix}stop\n`, true)
    .setFooter({text:'© Copyright 2022 Andrew Lee. Licensed with GPL-3.0.'})
    .setColor('#0066ff')

    msg.channel.send({ embeds: [helpEmbed]});

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
    fileData = "Now Playing: Nothing";
    fs.writeFile("now-playing.txt", fileData, (err) => { 
    if (err) 
    console.log(err); 
    }); 
    audio = "Not Playing";
    player.stop();
    voiceChannel.leave();
  }

  if (command == 'stop') {
    await msg.reply('Powering off...');
    fileData = "Now Playing: Nothing";
    await fs.writeFile("now-playing.txt", fileData, (err) => { 
    if (err) 
    console.log(err); 
    }); 
    const statusEmbed = new Discord.MessageEmbed()
    .setAuthor({title:bot.user.username, url:bot.user.avatarURL()})
    .setDescription(`That\'s all folks! Powering down ${bot.user.username}...`)
    .setColor('#0066ff')
    let statusChannel = bot.channels.cache.get(config.statusChannel);
    if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
    await statusChannel.send({ embeds: [statusEmbed] });
    console.log('Powering off...');
    player.stop();
    bot.destroy();
    process.exit(0);
  }

});
