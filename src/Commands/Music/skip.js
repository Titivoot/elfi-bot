module.exports = {
    name: 'skip',
    description: 'Skip Music',
    options: [],
    execute: async (client, interaction) => {
        const channel = interaction.member.voice?.channel;
        if (!channel) {
            return interaction.reply({ 
                embeds: [
                    {
                        description: '<:check_no:828337078185099274> Please join voice channel first',
                        color: '#FF0000'
                    }
                ],
                ephemeral: true
            })
        }

        player = client.music.players.get(interaction.guild.id)
        if (!player) return interaction.reply({
            embeds: [
                {
                    description: '<:check_warning:828337107373785158> The bot is not currently playing music',
                    color: '#FEF200'
                }
            ],
            ephemeral: true
        })

        if (player && channel.id !== player.voiceChannel) return interaction.reply({
            embeds: [
                {
                    description: '<:check_no:828337078185099274> Please enter the same voice room as the bot',
                    color: '#FF0000'
                }
            ],
            ephemeral: true
        })

         await player.stop()

        return interaction.reply({
            embeds: [
                {
                    author: {
                        name: 'Elfi Player'
                    },
                    description: `<:check_yes:828337028798218281> skip song successfully`,
                    color: '#00FF00',
                    timestamp: new Date(),
                    footer: {
                        text: `${interaction.user.tag} | Version ${client.config.Bot_Version}`,
                        icon_url: interaction.member.displayAvatarURL(),
                    }
                }
            ],
            ephemeral: true
        })
    }
}