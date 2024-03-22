const fs = require("node:fs");
const { MainDatabase: db } = require("../utils/database.js");

module.exports = {
    run: async (client, channel, tags, message, self, args) =>
    {
        switch (args[0])
        {
            case "add":
                const commandName = args[1];

                if (!commandName)
                {
                    return client.say(channel, "The name of the command is missing to create it !");
                }

                const commandsAlreadyExist = [];
                fs.readdirSync(`${__dirname}`)
                .filter(file => file)
                .forEach((i) =>
                {
                    const replacer = i.replace(".js", "");
                    commandsAlreadyExist.push(replacer);
                });

                if (commandsAlreadyExist.includes(commandName))
                {
                    return client.say(channel, `${commandName} is a bot command and cannot be replaced !`);
                }

                const searchCommand = await db.has(`txt.${commandName}`);

                if (!searchCommand)
                {
                    const commandTxt = args.splice(2).join(" ");

                    if (!commandTxt)
                    {
                        return client.say(channel, "The text is missing to create the command !");
                    }

                    await db.set(`txt.${commandName}`, `${commandTxt}`);
                    client.say(channel, `The command ${commandName} has been added`);
                }
                else
                {
                    return client.say(channel, `The command ${commandName} already exist !`);
                }
            break;

            case "del":
            case "delete":
            case "remove":
            case "rm":
                const commandToDelete = args[1];

                if (!commandToDelete)
                {
                    return client.say(channel, "The name of the command to be deleted is missing !");
                }

                const searchCommandToDelete = await db.has(`txt.${commandToDelete}`);
                if (searchCommandToDelete)
                {
                    await db.delete(`txt.${commandToDelete}`);
                    client.say(channel, `The command ${commandToDelete} has been deleted !`);
                }
                else
                {
                    return client.say(channel, `The command ${commandToDelete} does not exist !`);
                }
            break;

            case "edit":
            case "modify":
                const commandToEdit = args[1];

                if(!commandToEdit)
                {
                    return client.say(channel, "The name of the command is missing so that it can be edited !");
                }

                const searchCommandToEdit = await db.has(`txt.${commandToEdit}`);

                if (!searchCommandToEdit)
                {
                    return client.say(channel, `The command ${commandToEdit} does not exist`);
                }
                else
                {
                    const textToEdit = args.splice(2).join(" ");

                    if (!textToEdit)
                    {
                        return client.say("The command needs a text to be edited !");
                    }

                    await db.set(`txt.${commandToEdit}`, `${textToEdit}`);
                    client.say(channel, `${commandToEdit} has been edited !`);
                }
            break;

            case "list":
            case "ls":
                const getTxtCommands = await db.get("txt");
                const strCommands = Object.keys(getTxtCommands).reverse().join(" | ");

                client.say(channel, `List of txt commands ► ${strCommands}`);
            break;

            default:
                client.say(channel, "Incorrect use of the txt command");
            break;
        }
    },
    name: "txt",
    permission: ["moderator", "broadcaster"]
}