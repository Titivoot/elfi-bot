const { Client, Intents } = require('discord.js')
const Cluster = require("discord-hybrid-sharding");

const { resolve } = require('path')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)

class Elfi extends Client {
    constructor() {
        super({
            shards: Cluster.data.SHARD_LIST,
            shardCount: Cluster.data.TOTAL_SHARDS,
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_VOICE_STATES
            ],
            allowedMentions: { parse: [] }
        })

        this.config = require(resolve('./config'))
        this.logger = require(resolve('./src/Utils/Logger'))
        this.cluster = new Cluster.Client(this)

        this.loadHandlers()

        this.login()
    }

    async loadHandlers() {
        const handlers = await readdir(resolve('./src/Handlers'))
        handlers.forEach(file => {
            require(resolve(`./src/Handlers/${file}`))(this)
        })
    }
}

const ElfiBot = new Elfi()
