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
                    return client.say(channel, "Il manque le nom de la commande pour pouvoir la créer !");
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
                    return client.say(channel, `${commandName} est une commande du bot, impossible de la remplacer !`);
                }

                const searchCommand = await db.has(`txt.${commandName}`);

                if (!searchCommand)
                {
                    const commandTxt = args.splice(2).join(" ");

                    if (!commandTxt)
                    {
                        return client.say(channel, "Il manque le texte pour pouvoir créer la commande !");
                    }

                    await db.set(`txt.${commandName}`, `${commandTxt}`);
                    client.say(channel, `La commande ${commandName} a bien été ajoutée`);
                }
                else
                {
                    return client.say(channel, `La commande ${commandName} existe déjà. Editez la avec +txt edit !`);
                }
            break;

            case "del":
            case "delete":
            case "remove":
            case "rm":
                const commandToDelete = args[1];

                if (!commandToDelete)
                {
                    return client.say(channel, "Il manque le nom de la commande à supprimer !");
                }

                const searchCommandToDelete = await db.has(`txt.${commandToDelete}`);
                if (searchCommandToDelete)
                {
                    await db.delete(`txt.${commandToDelete}`);
                    client.say(channel, `La commande ${commandToDelete} a bien été supprimé !`);
                }
                else
                {
                    return client.say(channel, `La commande ${commandToDelete} n'existe pas !`);
                }
            break;

            case "edit":
            case "modify":
                const commandToEdit = args[1];

                if(!commandToEdit)
                {
                    return client.say(channel, "Il manque le nom de la commande afin de pouvoir l'éditer");
                }

                const searchCommandToEdit = await db.has(`txt.${commandToEdit}`);

                if (!searchCommandToEdit)
                {
                    return client.say(channel, `La commande ${commandToEdit} n'existe pas`);
                }
                else
                {
                    const textToEdit = args.splice(2).join(" ");

                    if (!textToEdit)
                    {
                        return client.say(`La commande à besoin d'un texte pour être édité !`);
                    }

                    await db.set(`txt.${commandToEdit}`, `${textToEdit}`);
                    client.say(channel, `${commandToEdit} a bien été édité !`);
                }
            break;

            case "list":
            case "ls":
                const getTxtCommands = await db.get("txt");
                const strCommands = Object.keys(getTxtCommands).reverse().join(" | ");

                client.say(channel, `Liste des commandes txt ► ${strCommands}`);
            break;

            default:
                client.say(channel, "Mauvaise utilisation de la commande txt");
            break;
        }
    },
    name: "txt",
    permission: ["moderator", "broadcaster"]
}