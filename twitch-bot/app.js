require("dotenv").config({ path: `${process.cwd()}/../.env` });
const tmi = require("tmi.js");
const loadCommands = require("./utils/loadCommands.js");
const { MainDatabase: db } = require("./utils/database.js");
const { getRole } = require("./utils/getRole.js");

const client = new tmi.Client({
    options:
    {
        debug: true
    },
    identity:
    {
        username: process.env.twitchBotUsername,
        password: process.env.twitchBotToken
    },
    connection:
    {
        reconnect: true,
        maxReconnectAttempts: 3,
        reconnectInterval: 15
    },
    channels: ["ex_ode"] // "nykho"
});

client.commands = new Map();
client.connect();

client.once("connected", async () =>
{
    const prefix = await db.getPrefix();
    loadCommands(client);
    client.on("chat", async (channel, tags, message, self) =>
    {
        if (!message.startsWith(prefix) || self) return;
        const args = message.slice(prefix.length).trim().split(/ +/g);
        const isTxt = await db.has(`txt.${args[0]}`);

        if (isTxt) {
            const getTxt = await db.get(`txt.${args[0]}`)
            return client.say(channel, getTxt);
        }

        const command = args.shift();
        const cmd = client.commands.get(`${command}`);

        if (cmd)
        {
            if (cmd.permission.includes(getRole(tags, channel)))
            {
                cmd.run(client, channel, tags, message, self, args);
            }
            else
            {
                return;
            }
        }
        else
        {
            return;
        }
    });
});