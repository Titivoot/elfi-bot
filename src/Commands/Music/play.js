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
        if (player && channel.id !== player.voiceChannel) {
            return interaction.reply({
                embeds: [
                    {
                        description: '<:check_no:828337078185099274> Please enter the same voice room as the bot',
                        color: '#FF0000'
                    }
                ],
                ephemeral: true
            })
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
        if (!res) return interaction.reply({
            embeds: [
                {
                    description: `<:check_no:828337078185099274> Couldn't find the song you searched for ${search}`,
                    color: '#FF0000'
                }
            ],
            ephemeral: true
        })

        if (player.state !== 'CONNECTED') {
            player.connect()
            player.set('playerauthor', interaction.user)
            player.play()
            player.pause(false)
        }

        let playembed = {}
        if (res.loadType === 'PLAYLIST_LOADED') {
            player.queue.add(res.tracks)
            playembed = {
                author: {
                    name: 'Elfi Player'
                },
                thumbnail: {
                    url: res.playlist.thumbnail
                },
                description: `Add playlist **${`[${res.playlist.name}](${res.playlist.uri})`.substr(0, 256 - 3)}** to the queue.`,
                color: '#00FF00',
                fields: [
                    {
                        name: ':hourglass: Duration',
                        value: `\`${format(res.playlist.duration)} sec\``,
                        inline: true
                    },
                    {
                        name: ':notes: Queue songs',
                        value: `\`${player.queue.length} songs\``
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: `${interaction.user.tag} | Version ${client.config.Bot_Version}`,
                    icon_url: interaction.member.displayAvatarURL(),
                }
            }
        } else {
            player.queue.add(res.tracks[0]);
            let tn = !res.tracks[0].thumbnail.startsWith('https://img.youtube.com') ? res.tracks[0].thumbnail : `https://img.youtube.com/vi/${res.tracks[0].identifier}/maxresdefault.jpg`
            playembed = {
                author: {
                    name: 'Elfi Player'
                },
                thumbnail: {
                    url: tn
                },
                description: `Add song **${`[${res.tracks[0].title}](${res.tracks[0].uri})`.substr(0, 256 - 3)}** to the queue.`,
                color: '#00FF00',
                fields: [
                    {
                        name: ':hourglass: Duration',
                        value: `\`${format(res.tracks[0].duration)} sec\``,
                        inline: true
                    },
                    {
                        name: ':star: Author',
                        value: `\`${res.tracks[0].author}\``,
                        inline: true
                    },
                    {
                        name: ':notes: Queue songs',
                        value: `\`${player.queue.length} songs\``
                    }
                ],
                timestamp: new Date(),
                footer: {
                    text: `${interaction.user.tag} | Version ${client.config.Bot_Version}`,
                    icon_url: interaction.member.displayAvatarURL(),
                }
            }
        }

        if (player.playing == false) {
            player.play()
        }

        await interaction.reply({ embeds: [playembed], ephemeral: true })
    }
}

const format = (time) => {
    try {
        time = Math.floor(time / 1000)
        let hrs = ~~(time / 3600)
        let mins = ~~((time % 3600) / 60)
        let secs = ~~time % 60
        let ret = ''
        if (hrs > 0) {
            ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
        }
        ret += '' + mins + ':' + (secs < 10 ? '0' : '')
        ret += '' + secs;
        return `${ret} | ${time}`
    } catch (err) {
        client.logger.log(String(err), 'error')
    }
}