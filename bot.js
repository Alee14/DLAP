/*********************************************
 * 
 *  Project Jul-2020 Discord Bot
 *  By: Andrew Lee
 * 
 *  Licensed with GPL-3.0
 * 
 *********************************************/
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json');
let dispatcher;

client.login(config.token);

function playAudio() {
  const channel = client.channels.cache.get(config.voiceChannel);
  if (!channel) return console.error('The channel does not exist!');
  
  channel.join().then(connection => {
    console.log('Connected to the voice channel.');
    let files = fs.readdirSync('./music');
    let audio;

    while (true) {
      audio = files[Math.floor(Math.random() * files.length)];
      console.log('Searching file...');
      if (audio.endsWith('.mp3')) {
        break;
      }
    }

    dispatcher = connection.play('./music/' + audio);

    console.log('Now playing ' + audio);
    let serviceChannel = client.channels.cache.get('606602551634296968');
    serviceChannel.send('**Project Jul-2020 Bot:**\nNow playing ' + audio);
    
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
  console.log(`Voice Channel: ${config.voiceChannel}\n`);

  client.user.setStatus('invisible');
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
    msg.channel.send(`Bot help:\n\`\`\`${config.prefix}help\n${config.prefix}ping\n${config.prefix}git\n${config.prefix}about\n\nFeel free to either lower the volume or mute me if it gets annoying!\n\`\`\``)
  }

  if (command == 'ping') {
    msg.reply('Pong!');
  }

  if (command == 'git') {
    msg.reply("This is the source code of this project.\nhttps://github.com/Alee14/PJ2020-Discord-Bot")
  }
  
  if (command == 'about') {
    msg.channel.send("This bot was created by Andrew Lee. Written in Discord.JS and licensed with GPL-3.0.")
  }

  if (![config.botOwner].includes(msg.author.id)) return;

  // Bot owner exclusive


  if (command == 'join') {
    msg.reply('Joining voice channel.');
    playAudio();
  }

  if (command == 'skip') {
    msg.reply("Skipping...")
    dispatcher.pause();
    dispatcher = null
    playAudio();
  }

  if (command == 'leave') {
    const channel = client.channels.cache.get(config.voiceChannel);
    if (!channel) return console.error('The channel does not exist!');
    msg.reply('Leaving voice channel.')
    console.log('Leaving voice channel.');
    channel.leave();
  }

  if (command == 'stop') {
    await msg.reply('Powering off...')
    console.log('Powering off...');
    client.destroy();
    process.exit(0);
  }

});