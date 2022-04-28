module.exports = {
    name: 'play',
    description: 'คำสั่งเปิดเพลง',
    options: [
        {
            name: 'music',
            description: 'Link or Name of the music',
            type: 'STRING',
            required: true
        }
    ],
    execute: async (client, interaction) => {
        const search = interaction.options.getString('music');
        const channel = interaction.member.voice?.channel;
        if (!channel) {
            return interaction.reply({ content: 'Please enter the voice room before use.', ephemeral: true })
        }

        player = client.music.players.get(interaction.guild.id)
        if (player && channel.id !== player.voiceChannel) {
            return interaction.reply({ content: 'Please enter the same voice room as the bot.', ephemeral: true})
        }

        if (!player) {
            player = client.music.create({
                guild: interaction.guild.id,
                voiceChannel: interaction.member.voice.channel.id,
                textChannel: interaction.channel.id
            })
            player.connect()
        }

        let res = await client.music.search(`${search}`, interaction.user)
        if (!res) return interaction.reply({ content: `Can't find the song you searched for?`, ephemeral: true })

        if (player.state !== 'CONNECTED') {
            player.connect()
            player.set('playerauthor', interaction.user)
            player.play()
            player.pause(false)
        }

        if (res.loadType === 'PLAYLIST_LOADED') {
            player.queue.add(res.tracks)
        } else {
            player.queue.add(res.tracks[0]);
        }

        if (player.playing == false) {
            player.play()
        }

        await interaction.reply({ content: 'Successfully added song', ephemeral: true })
    }
}
  