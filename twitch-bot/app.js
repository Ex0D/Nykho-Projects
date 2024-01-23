require("dotenv").config({ path: `${__dirname}/../.env` });
const tmi = require("tmi.js");
const loadCommands = require("./utils/loadCommands.js");
const { loadSchedule, checkMessagesActivity } = require("./utils/scheduleUtils.js");
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
    channels: ["nykho"]
});

client.commands = new Map();
client.connect();

client.once("connected", async () =>
{
    loadSchedule(client);
    loadCommands(client);
    client.on("chat", async (channel, tags, message, self) =>
    {
        const prefix = await db.getPrefix();
        if (self) return;
        if (!message.startsWith(prefix))
        {
            return checkMessagesActivity(client);
        }
        else
        {
            const args = message.slice(prefix.length).trim().split(/ +/g);
            const isTxt = await db.has(`txt.${args[0]}`);

            if (isTxt)
            {
                const getTxt = await db.get(`txt.${args[0]}`)
                return client.say(channel, getTxt);
            }

            const command = args.shift();
            const cmd = client.commands.get(`${command}`);

            if (cmd)
            {
                if (cmd.permission.includes(getRole(tags, channel)))
                {
                    return cmd.run(client, channel, tags, message, self, args);
                }
                else
                {
                    return;
                }
            }
        }
    });
});