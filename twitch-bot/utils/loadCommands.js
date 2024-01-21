const fs = require("node:fs");

module.exports = async function loadCommands(client)
{
    const commandFiles = fs.readdirSync(`${__dirname}/../commands`).filter(file => file.endsWith('.js'))

    for (const file of commandFiles)
    {
        const command = require(`${__dirname}/../commands/${file}`);
        client.commands.set(command.name, command);
    };
};