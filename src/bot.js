const { Client, Intents, Collection } = require('discord.js')

const { resolve } = require('path')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)

class Bot extends Client {
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_WEBHOOKS,
                Intents.FLAGS.GUILD_PRESENCES
            ],
            allowedMentions: { parse: [] }
        })

        this.config = require(resolve('./config.json'))
        this.commands = new Collection()

        this.loadEvents()
        this.loadCommands()

        this.login(this.config.Bot_Token)
    }

    async loadEvents() {
        const directories = await readdir(resolve('./src/Events'))
        directories.forEach(async (dir) => {
            const events = await readdir(resolve(`./src/Events/${dir}`))
            events.forEach(file => {
                if (!file.endsWith('.js')) return
                try {
                    const event = require(resolve(`./src/Events/${dir}/${file.split('.')[0]}`))
                    this.on(event.eventType, event.run.bind(event, this))
                } catch (err) {
                    console.error(err)
                }
            })
        })
    }

    async loadCommands() {
        const categories = await readdir(resolve('./src/Commands'))
        categories.forEach(async (dir) => {
            const commands = await readdir(resolve(`./src/Commands/${dir}`))
            commands.forEach(file => {
                const command = require(resolve(`./src/Commands/${dir}/${file}`))
                try {
                    if (command.name) {
                        this.commands.set(command.name, command)
                    }
                } catch (err) {
                    console.error(err)
                }
            })
        })
    }
}

module.exports = Bot