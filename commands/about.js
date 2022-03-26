const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, version, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Information about the bot'),
    async execute(interaction, bot) {
        const aboutEmbed = new MessageEmbed()
            .setAuthor({name:`About ${bot.user.username}`, iconURL:bot.user.avatarURL()})
            .addField('Information', 'A Discord bot that plays local mp3 audio tracks.')
            .addField('Original Creator', 'Andrew Lee (Alee#4277)')
            .addField('Frameworks', `Discord.JS ${version} + Voice`)
            .addField('License', 'GNU General Public License v3.0')
            .setFooter({text:'© Copyright 2020-2022 Andrew Lee. Licensed with GPL-3.0.'})
            .setColor('#0066ff')

        const srcOrig = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('LINK')
                    .setLabel('Original Source Code')
                    .setURL('https://github.com/Alee14/DLMP3'),
            );

        return interaction.reply({ embeds:[aboutEmbed], components:[srcOrig] });
    },
};