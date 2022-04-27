const { resolve } = require('path')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir)

module.exports = async (client) => {
    client.events = new Array()
    try {
        const events = await readdir(resolve('./src/Events'))
        events.forEach(file => {
            if (!file.endsWith('js')) return
            try {
                const event = require(resolve(`./src/Events/${file}`))
                const eventName = file.split('.')[0]
                client.events.push(eventName)
                client.on(event.eventName, event.run.bind(null, client))
                client.logger.log(`Loaded Event ${event.eventName}`, 'info')
            } catch (err) {
                client.logger.log(String(err), 'error')
            }
        });
    } catch (err) {
        client.logger.log(String(err), 'error')
    }
}