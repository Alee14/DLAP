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

function playAudio() {
  let audio;
  const channel = client.channels.cache.get(voiceChannel);
  if (!channel) return console.error("The channel does not exist!");
  
  fs.readdir('./music', (err, files) => {
    if (err) console.error(err);
      audio = files[Math.floor(Math.random() * files.length)];
      return audio;
  });
  
  channel.join().then(connection => {
    console.log("Connected to the voice channel.");
    const dispatcher = connection.play("./music/" + audio);

    console.log("Project Jul-2020 Bot:\nNow playing " + audio);
    let serviceChannel = client.channels.cache.get('606602551634296968');
    serviceChannel.send("**Project Jul-2020 Bot:**\nNow playing " + audio);
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
    //This feature might not make it in
  }
  if (command == 'leave') {
    const channel = client.channels.cache.get(voiceChannel);
    if (!channel) return console.error("The channel does not exist!");
    console.log("Leaving voice channel.");
    channel.leave();
  }

});

client.login(config.token);