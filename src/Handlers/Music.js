const { Manager } = require('erela.js')

module.exports = async (client) => {
    client.music = new Manager({
        nodes: client.config.Music_Nodes,
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload)
        }
    })

    client.music
        .on('nodeConnect', (node) => {
            client.logger.log(`[Lavalink] ${node.options.identifier} connected.`, 'ready')
        })
        .on('nodeDisconnect', (node) => {
            client.logger.log(`[Lavalink] ${node.options.identifier} disconnect.`, 'warn')
        })
        .on('nodeError', (node, error) => {
            client.logger.log(`[Lavalink] ${node.options.identifier} error : ${error}`, 'error')
        })
        .on('playerMove', async (player, oldChannel, newChannel) => {
            if (!newChannel) {
                player.destroy()
            } else {
                player.voiceChannel = newChannel
                player.set('voiceChannel', player.newChannel)

                if (player.paused) return
                setTimeout(() => {
                    player.pause(true)
                    setTimeout(() => player.pause(false), 1000)
                }, 1000)
            }
        })
        .on('trackStart', async (player, track, payload) => {
            if (client.config.Bot_Debug) {
                client.logger.log(`Track Start ${track.title} -> ${player.guild}`, 'debug')
            }
            player.set('voiceChannel', player.voiceChannel)
            return
        })
        .on('trackStuck', async (player, track, payload) => {
            player.stop()
        })
        .on('trackError', async (player, track, payload) => {
            player.stop()
        })
        .on('queueEnd', async (player) => {
            player.destroy()
        })
    client.on('raw', (d) => client.music.updateVoiceState(d))
        .on('voiceStateUpdate', async (oldState, newState) => {
            if (oldState.channel && !newState.channel) {
                if (oldState.member.user.id === client.user.id) {
                    let player = client.music.get(oldState.guild.id);
                    if (!player) return
                    player.destroy()
                }
            }
            let player = client.music.players.get(newState.guild.id)
            if (!player) return
            if (oldState && oldState.channel) {
                if (!oldState.guild.me.voice.channel) return
                if (player && oldState.guild.channels.cache.get(player.voiceChannel).members.filter(member => member.user.bot === false).size === 0) {
                    player.destroy()
                }
            }
        })
}