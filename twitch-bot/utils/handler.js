const path = require('node:path');
const fs = require('node:fs');
const { Client } = require('tmi.js');

/**
 * @param {Client} client
 */
module.exports = (client) =>
{
    const commandsPath = path.join(__dirname, '../', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(files => files.endsWith('.js'));

    for (const file of commandFiles)
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('execute' in command && 'name' in command)
        {
            client.commands.set(command.name, command);
        }
        else
        {
            console.warn(`[WARNING] The command at ${filePath} is missing "name" or "execute" property`);
        }
    }

    const eventsPath = path.join(__dirname, '../', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles)
    {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);

        if (event.once)
        {
            client.once(event.name, (...args) => event.execute(...args));
        }
        else
        {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}