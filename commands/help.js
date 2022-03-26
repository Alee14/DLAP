const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists commands for the bot.'),
    async execute(interaction, bot) {
        const helpEmbed = new MessageEmbed()
            .setAuthor({name:`${bot.user.username} Help`, iconURL:bot.user.avatarURL()})
            //.setDescription(`Currently playing \`${audio}\`.`)
            .addField('Public Commands', `${config.prefix}help\n${config.prefix}ping\n${config.prefix}git\n${config.prefix}playing\n${config.prefix}about\n`, true)
            .addField('Bot Owner Only', `${config.prefix}join\n${config.prefix}resume\n${config.prefix}pause\n${config.prefix}skip\n${config.prefix}leave\n${config.prefix}stop\n`, true)
            .setFooter({text:'© Copyright 2020-2022 Andrew Lee. Licensed with GPL-3.0.'})
            .setColor('#0066ff')

        return interaction.reply({ embeds: [helpEmbed]});
    },
};