module.exports = {
    eventType: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.isCommand()) return
        const command = client.commands.get(interaction.commandName)
        if (!command) return interaction.reply('Error: Command not found.')

        if (command.ownerOnly) {
            if (!interaction.member.user.id === client.config.ownerID) return interaction.reply('Error: This command is for owners only.')
        }

        if (command.userPerms) {
            if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(interaction.member.id).permissions.has(command.userPerms || [])) {
                if (command.noUserPermsMessage) {
                    return interaction.reply(command.noUserPermsMessage)
                }
                
                return interaction.reply({
                    embeds: [
                        {
                            title: 'คุณไม่มีสิทธิ์ใช้งานคำสั่งนี้!',
                            description: `คุณไม่มีสิทธิ์ : ${command.userPerms}`,
                            color: "RANDOM",
                            timestamp: new Date(),
                            footer: {
                                text: interaction.user.tag,
                                icon_url: interaction.user.displayAvatarURL(),
                            }
                        }
                    ]
                })
            }
        }

        if (command.botPerms) {
            if (!client.guilds.cache.get(interaction.guild.id).members.cache.get(client.user.id).permissions.has(command.botPerms || [])) {
                if (command.noBotPermsMessage) {
                    return interaction.reply(command.noBotPermsMessage)
                }

                return interaction.reply({
                    embeds: [
                        {
                            title: 'เราไม่มีสิทธิ์ใช้งานคำสั่งนี้!',
                            description: `เราไม่มีสิทธิ์ : ${command.userPerms}`,
                            color: "RANDOM",
                            timestamp: new Date(),
                            footer: {
                                text: interaction.user.tag,
                                icon_url: interaction.user.displayAvatarURL(),
                            }
                        }
                    ]
                })
            }
        }

        const args = [];

        interaction.options.data.forEach((option) => {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name)
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value)
                })
            } else if (option.value) args.push(option.value)
        })

        try {
            command.execute(client, interaction)
        } catch (err) {
            console.error(err)
        }
    }

}
  