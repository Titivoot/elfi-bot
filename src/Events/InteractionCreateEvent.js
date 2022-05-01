module.exports = {
    eventName: 'interactionCreate',
    run: async (client, interaction) => {

        // Use commands only on the server.
        if (!interaction.guild) return interaction.reply({ content: 'Command can only be executed in a discord server', ephemeral: true })

        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)

            // Debug Log 
            if(client.config.Bot_Debug)
                client.logger.log(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName}`, 'debug')
            }

            // Add bot permission SEND_MESSAGES, EMBED_LINKS by default.
            if (!command.botPerms.includes('EMBED_LINKS')) {
                command.botPerms.push('EMBED_LINKS')
            }
            if(!command.botPerms.includes('SEND_MESSAGES')) {
                command.botPerms.push('SEND_MESSAGES')
            }

            // Check User Permissions
            if (command.userPerms) {
                let needUserPerms = []
                command.userPerms.forEach(perms => {
                    if(!client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id).permissions.has(perms || [])) {
                        needUserPerms.push(perms)
                    }
                })
                if(needUserPerms.length > 0) {
                    return interaction.reply(`You need the following permissions to execute this command: ${needUserPerms.map((p) => `\`${p}\``).join(", ")}`)
                }
            }

            // Check Bot Permissions
            if (command.botPerms) {
                let needBotPerms = []
                command.botPerms.forEach(perms => {
                    if(!client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id).permissions.has(perms || [])) {
                        needBotPerms.push(perms)
                    }
                })
                if(needBotPerms.length > 0) {
                    return interaction.reply(`I need the following permissions to execute this command: ${needBotPerms.map((p) => `\`${p}\``).join(", ")}`)
                }
            }

            // Execute Commands
            if (command) await command.execute(client, interaction)
            else return interaction.reply({ content: 'An error has occurred', ephemeral: true })
        }
    }
}