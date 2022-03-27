const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists the commands'),
    async execute(interaction, bot, audio) {
        const helpEmbed = new MessageEmbed()
            .setAuthor({name:`${bot.user.username} Help`, iconURL:bot.user.avatarURL()})
            .setDescription(`Currently playing \`${audio}\`.`)
            .addField('Public Commands', `/help\n/ping\n/about\n`, true)
            .addField('Bot Owner Only', `/join\n/control\n/stop\n`, true)
            .setFooter({text:'© Copyright 2020-2022 Andrew Lee. Licensed with GPL-3.0.'})
            .setColor('#0066ff')

        return interaction.reply({ embeds: [helpEmbed]});
    },
};