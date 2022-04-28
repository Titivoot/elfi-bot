const colors = require('colors')

class Logger {
    static log(content, type='info', newline=true) {
        switch(type) {
            case 'info': {
                return process.stdout.write(`${`[`.gray}${`${createDateTime()}`.blue}${`]`.gray} ${`[`.gray}${`${type.toLocaleUpperCase()}`.cyan}${`]`.gray} ${`${content}`.white} ${newline ? '\n': ''}`)
            }
            case 'ready': {
                return process.stdout.write(`${`[`.gray}${`${createDateTime()}`.blue}${`]`.gray} ${`[`.gray}${`${type.toLocaleUpperCase()}`.green}${`]`.gray} ${`${content}`.white} ${newline ? '\n': ''}`)
            }
            case 'warn': {
                return process.stdout.write(`${`[`.gray}${`${createDateTime()}`.blue}${`]`.gray} ${`[`.gray}${`${type.toLocaleUpperCase()}`.yellow}${`]`.gray} ${`${content}`.white} ${newline ? '\n': ''}`)
            }
            case 'error': {
                return process.stdout.write(`${`[`.gray}${`${createDateTime()}`.blue}${`]`.gray} ${`[`.gray}${`${type.toLocaleUpperCase()}`.red}${`]`.gray} ${`${content}`.white} ${newline ? '\n': ''}`)
            }
            case 'debug': {
                return process.stdout.write(`${`[`.gray}${`${createDateTime()}`.blue}${`]`.gray} ${`[`.gray}${`${type.toLocaleUpperCase()}`.grey}${`]`.gray} ${`${content}`.white} ${newline ? '\n': ''}`)
            }
            default: throw new TypeError('Logger type must be either warn, ready, info or error.')
        }
    }
}

const createDateTime = (timestamp) => {
    if (!timestamp) timestamp = Date.now()
    return new Date(timestamp).toLocaleString('th-TH')
}

module.exports = Logger