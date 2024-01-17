const { MainDatabase: db } = require("../utils/database.js");

module.exports = {
    run: async (client, channel, tags, message, self, args) =>
    {
        const prefix = args[0];
        const prefixInDb = db.get(`config.prefix`);
        if (prefix === prefixInDb)
        {
            return client.say(channel, `${prefix} est déjà le prefix en cours d'utilisation !`);
        }
        else
        {
            await db.set(`config.prefix`, `${prefix}`)
            return client.say(channel, `${prefix} est désormais le nouveau préfix du bot !`);
        }
    },
    name: "prefix",
    permission: ["broadcaster"]
}