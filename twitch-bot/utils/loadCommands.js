const fs = require("node:fs");

module.exports = async function loadCommands(client)
{
    const commandFiles = fs.readdirSync(`${process.cwd()}/commands`).filter(file => file.endsWith('.js'))

    for (const file of commandFiles)
    {
        const command = require(`${process.cwd()}/commands/${file}`);
        client.commands.set(command.name, command);
    };
};