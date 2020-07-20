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

    const dispatcher = connection.play('./music/' + audio);

    console.log('Now playing ' + audio);
    let serviceChannel = client.channels.cache.get('606602551634296968');
    serviceChannel.send('**Project Jul-2020 Bot:**\nNow playing ' + audio);

  }).catch(e => {
    console.error(e);
  });
}
client.on('ready', () => {
  console.log('Bot is ready!')
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Prefix: ${config.prefix}`);
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
    msg.channel.send(`Bot help:\n\`\`\`${config.prefix}help\n${config.prefix}ping\n${config.prefix}git\n\`\`\``)
  }

  if (command == 'git') {
    msg.reply("This is the source code of this project.\nhttps://github.com/Alee14/PJ2020-Discord-Bot")
  }
    
  if (command == 'ping') {
    msg.reply('Pong!');
  }

  if (![config.botOwner].includes(msg.author.id)) return;

  // Bot owner exclusive

  if (command == 'stop') {
    await msg.reply('Powering off...')
    console.log('Powering off...');
    client.destroy();
    process.exit(0);
  }

  if (command == 'join') {
    // Only try to join the sender's voice channel if they are in one themselves
    msg.reply('Joining voice channel.');
    playAudio();
  }
  if (command == 'skip') {

  }

  if (command == 'leave') {
    const channel = client.channels.cache.get(config.voiceChannel);
    if (!channel) return console.error('The channel does not exist!');
    msg.reply('Leaving voice channel.')
    console.log('Leaving voice channel.');
    channel.leave();
  }

});