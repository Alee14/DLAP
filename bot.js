/*********************************************
 * 
 *  Project Jul-2020 Discord Bot
 *  By: Andrew Lee
 * 
 *  Licensed with GPL-3.0
 * 
 *********************************************/
const Discord = require('discord.js');
const fs = require("fs");
const client = new Discord.Client();
const config = require('./token.json');
let botOwner = "242775871059001344";
var voiceChannel = "734184921433899108";
var prefix = "!";

function fetchAudio() {
  fs.readdir('./music', (err, files) => {
    if (err) console.error(err);
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      console.log(`Fetching ${file}`); 
  });
  });
}

function playAudio() {
  const channel = client.channels.cache.get(voiceChannel);
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    console.log("Connected to the voice channel.");
    fetchAudio();
    connection.play('./music/4616-werq-by-kevin-macleod.mp3');
  }).catch(e => {
    console.error(e);
  });
}

client.on('ready', () => {
  console.log("Bot is ready!")
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Prefix: ${prefix}`);
  client.user.setStatus("invisible");
  playAudio();
});

client.on('message', async msg => {
    if (msg.author.bot) return;
    if (!msg.guild) return;
    if (!msg.content.startsWith(prefix)) return;
    if (![botOwner].includes(msg.author.id)) return;
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  
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
    const channel = client.channels.cache.get(voiceChannel);
    if (!channel) return console.error("The channel does not exist!");
    console.log("Leaving voice channel.");
    channel.leave();
  }
});

client.login(config.token);