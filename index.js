const Cluster = require('discord-hybrid-sharding')
const config = require('./config.json')
const logger = require('./src/Utils/Logger')

const manager = new Cluster.Manager(`${__dirname}/src/Elfi.js`, {
    totalShards: config.Bot_totalShards,
    shardsPerClusters: config.Bot_shardsPerClusters,
    totalClusters: config.Bot_totalClusters,
    mode: 'process',
    keepAlive: {
        interval: 2000,
        maxMissedHeartbeats: 5,
    },
    token: config.Bot_Token
})

if (config.Bot_Debug) {
    logger.log(`The debug mode is enable. You can disable the debug mode in the config.json file.`, 'warn')
}

manager.on('clusterCreate', cluster => logger.log(`Launched Cluster ${cluster.id} => ${cluster.shardList}`, 'info'))
manager.spawn({ timeout: -1 })