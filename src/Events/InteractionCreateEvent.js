module.exports = {
    eventName: 'interactionCreate',
    run: async (client, interaction) => {

        if (!interaction.guild) return interaction.reply({ content: 'Command can only be executed in a discord server', ephemeral: true })

        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            client.logger.log(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName}`, 'debug')
            if (command.ownerOnly) {
                if (!interaction.member.user.id === client.config.ownerID) return interaction.reply({ content: 'This command is for owners only.', ephemeral: true })
            }

            if (command.userPerms) {
                if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id).permissions.has(command.userPerms || [])) {
                    if (command.noUserPermsMessage) {
                        return interaction.reply(command.noUserPermsMessage)
                    }
                    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true })
                }
            }

            if (command.botPerms) {
                if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id).permissions.has(command.botPerms || [])) {
                    if (command.noBotPermsMessage) {
                        return interaction.reply(command.noBotPermsMessage)
                    }
                    return interaction.reply({ content: 'The bot does not have permission to use this command.', ephemeral: true })
                }
            }

            if (command) await command.execute(client, interaction)
            else return interaction.reply({ content: 'An error has occurred', ephemeral: true })
        }
    }
}