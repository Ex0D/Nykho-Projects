const client = require('../app.js');

module.exports = 
{
    name: "message",
    once: false,
    execute: execute
}

/**
 * @param {String} channel
 * @param {Object} user
 * @param {String} message
 * @param {Boolean} self
 */
async function execute(channel, user, message, self)
{
    if (self) return;
    const prefix = "+"


        const args = message.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        if(cmd.includes('\\') || cmd.includes('.') || cmd.includes('/')) return;
        const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(commander => commander.aliases && commander.aliases.includes(cmd.toLowerCase()));

        if(!cmd) return;
        command.execute(channel, user, message, self, args);
}