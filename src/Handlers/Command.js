const { Collection } = require('discord.js')

const { resolve } = require('path')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)

module.exports = async (client) => {
    client.commands = new Collection()
    client.commandsArray = new Array()

    try {
        const categories = await readdir(resolve('./src/Commands'))
        categories.forEach(async (dir) => {
            const commands = await readdir(resolve(`./src/Commands/${dir}`))
            commands.forEach(file => {
                const command = require(resolve(`./src/Commands/${dir}/${file}`))
                try {
                    client.logger.log(`Loaded Command ${command.name}`, 'info')
                    client.commands.set(command.name, command)
                    client.commandsArray.push({
                        name: command.name,
                        description: command.description,
                        options: command.options
                    })
                } catch (err) {
                    client.logger.log(String(err), 'error')
                }
            })
        })
    } catch (err) {
        client.logger.log(String(err), 'error')
    }
}