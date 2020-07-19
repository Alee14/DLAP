/*********************************************
 * 
 *  Project Jul-2020 Discord Bot
 *  By: Andrew Lee
 * 
 *  Licensed with GPL-3.0
 * 
 *********************************************/
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./token.json');
var prefix = "!";
var voiceChannel = "734184921433899108";

function playAudio() {
  const channel = client.channels.cache.get(voiceChannel);
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    console.log("Successfully connected to this channel.");
    connection.play('./music/4616-werq-by-kevin-macleod.mp3');
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Prefix: ${prefix}`);
  client.user.setStatus("invisible");
  playAudio();
});

client.on('message', async msg => {
    if (!['242775871059001344'].includes(msg.author.id)) return;
    if (!msg.guild) return;
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
  
    let command = msg.content.split(" ")[0];
    command = command.slice(prefix.length);

  if (command == 'ping') {
    msg.reply('Pong!');
  }

  if (command == 'stop') {
    await msg.reply("Powering off...")
    console.log("Powering off...");
    client.destroy();
    process.exit(0);
  }

  if (command == 'join') {
    // Only try to join the sender's voice channel if they are in one themselves
      playAudio();
  }
  if (command == 'skip') {
    //TODO
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