const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('control')
        .setDescription('Controlling the music'),
    async execute(interaction, bot) {
        const controlEmbed = new MessageEmbed()
            .setAuthor({name:`${bot.user.username} Control Panel`, iconURL:bot.user.avatarURL()})
            .addField('Currently Playing', 'audio file here')
            .addField('Next Music', '(a possible feature?)')
        const controlButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle('PRIMARY')
                    .setLabel('Pause/Play')
                    .setCustomId('soon')
            );
        return interaction.reply({embeds:[controlEmbed], components:[controlButtons]});
    },
};