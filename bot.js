const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./token.json');
const fs = require('fs');
let prefix = "!"

function fetchAudio() {
    
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('Prefix:', prefix);
});

client.on('message', async msg => {
    if (!['242775871059001344'].includes(msg.author.id)) return;
    if (!msg.guild) return;
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
  
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);

  if (command == 'ping') {
    msg.reply('Pong! '  + Math.round(client.ping) + ' ms');
  }

  if (command == 'poweroff') {
      console.log("Powering off...");
      client.destroy();
      process.exit(0);
  }

  if (command == 'join') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (msg.member.voice.channel) {
        console.log("Connected to voice chat...")
      const connection = await msg.member.voice.channel.join();
      connection.play('./music/4616-werq-by-kevin-macleod.mp3');
      console.log(connection)
    } else {
      msg.reply('You need to join a voice channel first!');
    }
  }

  if (command == 'leave') {
    // Only try to join the sender's voice channel if they are in one themselves
    if (msg.member.voice.channel) {
        console.log("Disconnected from voice chat...")
      const connection = await msg.member.voice.channel.leave();
    } else {
      msg.reply('You need to join a voice channel first!');
    }
  }
});

client.login(config.token);