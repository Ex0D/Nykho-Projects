const { MainDatabase: db } = require("../utils/database.js");

module.exports = {
    run: async (client, channel, tags, message, self, args) =>
    {
        const prefix = args[0];

        if (!prefix)
        {
            return client.say(channel, `Mauvaise utilisation de la commande prefix !`);
        }

        const prefixInDb = await db.getPrefix();

        if (prefix === prefixInDb)
        {
            return client.say(channel, `${prefix} est déjà le prefix en cours d'utilisation !`);
        }
        else
        {
            await db.setPrefix(prefix);
            return client.say(channel, `${prefix} est désormais le nouveau préfix du bot !`);
        }
    },
    name: "prefix",
    permission: ["broadcaster"]
}