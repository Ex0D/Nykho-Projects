const { getRole } = require("../utils/getRole.js");

module.exports = {
    run: async (client, channel, tags, message, self, args) =>
    {
        const cmdsName = [];
        client.commands.forEach((v) =>
        {
            if (v.permission.includes(getRole(tags, channel)))
            {
                cmdsName.push(v.name);
            }
        });

        const joined = cmdsName.join(" | ");
        client.say(channel, `Commandes du bot ► ${joined}`);
    },
    name: "help",
    permission: ["broadcaster", "moderator", "vip", "viewer"]
}