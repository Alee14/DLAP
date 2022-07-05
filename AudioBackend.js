/**************************************************************************
 * 
 *  DLAP Bot: A Discord bot that plays local audio tracks.
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

import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnectionStatus
} from '@discordjs/voice'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import config from './config.json' assert {type: 'json'}
import { readdirSync, writeFile } from 'node:fs'

export const player = createAudioPlayer();
export let audio;
export let files = readdirSync('music');
let fileData;

let runOnce = false
export let playerState;
let isAudioStatePaused;

export async function voiceInit(bot) {
  bot.channels.fetch(config.voiceChannel).then(async channel => {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('Ready to blast some beats!');
    });

    connection.on(VoiceConnectionStatus.Destroyed, () => {
      console.log('Destroyed the beats...');
    });

    player.on('idle', () => {
      console.log("Beat has finished playing, shuffling the beats...");
      searchAudio(bot);
    })

    await searchAudio(bot);
    return connection.subscribe(player);
  }).catch(e => { console.error(e) })
}

export async function controlPanel(interaction, bot) {
  let controlEmbed
  let controlButtons
  let controlButtons2

  if (runOnce === true) return await interaction.reply({content:'You already executed this command', ephemeral:true})

  controlEmbed = new MessageEmbed()
      .setAuthor({name: `${bot.user.username} Control Panel`, iconURL: bot.user.avatarURL()})
      .addField('State', playerState)
      .addField('Currently Playing', audio)
      //.addField('Next Music', '(a possible feature when queue system is implemented?)')
      .setColor('#0066ff')

  controlButtons = new MessageActionRow()
      .addComponents(
          new MessageButton()
              .setStyle('SUCCESS')
              .setLabel('Join')
              .setCustomId('join')
              .setEmoji('⬆️')
              .setDisabled(true),
          new MessageButton()
              .setStyle('SECONDARY')
              .setLabel('Play')
              .setCustomId('play')
              .setEmoji('▶️')
              .setDisabled(true),
          new MessageButton()
              .setStyle('SECONDARY')
              .setLabel('Pause')
              .setCustomId('pause')
              .setEmoji('⏸️'),
          new MessageButton()
              .setStyle('SECONDARY')
              .setLabel('Skip')
              .setCustomId('skip')
              .setEmoji('⏭️'),
          new MessageButton()
              .setStyle('PRIMARY')
              .setEmoji('⏩')
              .setCustomId('next'),
      );

  controlButtons2 = new MessageActionRow()
      .addComponents(
          new MessageButton()
              .setStyle('PRIMARY')
              .setEmoji('⏪')
              .setCustomId('back'),
          new MessageButton()
              .setStyle('DANGER')
              .setLabel('Leave')
              .setCustomId('leave')
              .setEmoji('⏏️'),
          new MessageButton()
              .setStyle('DANGER')
              .setLabel('Power Off')
              .setCustomId('stop')
              .setEmoji('🛑')
      )

  const filter = i => i.user.id === config.botOwner;

  const collector = interaction.channel.createMessageComponentCollector({filter});

  collector.on('collect', async ctlButton => {
    if (ctlButton.customId === 'join') {
      controlButtons.components[0].setDisabled(true);
      controlButtons.components[1].setDisabled(true);
      controlButtons.components[2].setDisabled(false);
      controlButtons.components[3].setDisabled(false);
      controlButtons2.components[1].setDisabled(false);
      await interaction.editReply({components:[controlButtons]});
      await voiceInit(bot);
      return await ctlButton.reply({content:'Joining voice channel', ephemeral:true});
    }
    if (ctlButton.customId === 'play') {
      controlButtons.components[2].setDisabled(false);
      controlButtons.components[1].setDisabled(true);
      await interaction.editReply({components:[controlButtons]});
      audioState();
      player.unpause();
      return await ctlButton.reply({content:'Resuming music', ephemeral:true});
    }
    if (ctlButton.customId === 'pause') {
      controlButtons.components[2].setDisabled(true);
      controlButtons.components[1].setDisabled(false);
      await interaction.editReply({components:[controlButtons]});
      audioState();
      player.pause();
      return await ctlButton.reply({content:'Pausing music', ephemeral:true});
    }
    if (ctlButton.customId === 'skip') {
      player.stop();
      await searchAudio(bot, interaction);
      return await ctlButton.reply({content:`Skipping ${audio}`, ephemeral:true});
    }
    if (ctlButton.customId === 'next') {
      return await interaction.editReply({ components: [controlButtons2] }).then(ctlButton.deferUpdate());
    }
    if (ctlButton.customId === 'back') {
      return await interaction.editReply({ components: [controlButtons] }).then(ctlButton.deferUpdate());
    }
    if (ctlButton.customId === 'leave') {
      console.log('Leaving voice channel...');
      controlButtons.components[0].setDisabled(false);
      controlButtons.components[1].setDisabled(true);
      controlButtons.components[2].setDisabled(true);
      controlButtons.components[3].setDisabled(true);
      controlButtons2.components[1].setDisabled(true);
      await interaction.editReply({components:[controlButtons2]});
      await destroyAudio(interaction);
      return await ctlButton.reply({content:'Leaving voice channel', ephemeral:true});
    }
    if (ctlButton.customId === 'stop') {
      await ctlButton.reply({content:`Powering off ${bot.user.username}...`, ephemeral:true});
      await interaction.deleteReply();
      await collector.stop();
      return await stopBot(bot, interaction);
    }
  });

  collector.on('end', collected => console.log(`Collected ${collected.size} items`));

  runOnce = true
  return await interaction.reply({embeds:[controlEmbed], components:[controlButtons]});
}

export async function searchAudio(bot){
  //TODO: Eventually this system will need a rework so it won't repeat the same files.

  audio = files[Math.floor(Math.random() * files.length)];
  return await playAudio(bot);
}

export async function inputAudio(bot, integer) {
  audio = files[integer];
  return await playAudio(bot);
}

export async function playAudio(bot) {
  let resource = createAudioResource('music/' + audio);

  player.play(resource);

  console.log('Now playing: ' + audio);

  playerState = "Playing"
  isAudioStatePaused = false

  audio = audio.split('.').slice(0, -1).join('.');

  if (config.txtFile === true) {
    fileData = "Now Playing: " + audio
    writeFile("./now-playing.txt", fileData, (err) => {
      if (err)
        console.log(err);
    });
  }

  const statusEmbed = new MessageEmbed()
      .addField('Now Playing', `${audio}`)
      .setColor('#0066ff')

  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  return await statusChannel.send({embeds: [statusEmbed]});

}

export async function destroyAudio(interaction) {
  if (config.txtFile === true) {
    fileData = "Now Playing: Nothing";
    writeFile("now-playing.txt", fileData, (err) => {
      if (err)
        console.log(err);
    });
  }

  audio = "Not Playing"
  playerState = "Stopped"
  isAudioStatePaused = true

  const connection = getVoiceConnection(interaction.guild.id);
  if (VoiceConnectionStatus.Ready) {
    player.stop();
    return connection.destroy();
  }
}

export function audioState() {
  if (isAudioStatePaused === false) {
    isAudioStatePaused = true
    playerState = "Paused"
  } else if (isAudioStatePaused === true) {
    isAudioStatePaused = false
    playerState = "Playing"
  }
}

export async function stopBot(bot, interaction) {
  const statusEmbed = new MessageEmbed()
      .setAuthor({name: bot.user.username, iconURL: bot.user.avatarURL()})
      .setDescription(`That\'s all folks! Powering down ${bot.user.username}...`)
      .setColor('#0066ff')
  let statusChannel = bot.channels.cache.get(config.statusChannel);
  if (!statusChannel) return console.error('The status channel does not exist! Skipping.');
  await statusChannel.send({embeds: [statusEmbed]});

  console.log(`Powering off ${bot.user.username}...`);
  await destroyAudio(interaction);
  bot.destroy();
  return process.exit(0);
}