// Load dependencies / utils
require("dotenv").config({ path: `${__dirname}/../.env` });
const tmi = require("tmi.js");
const loadCommands = require("./utils/loadCommands.js");
const { loadSchedule, checkMessagesActivity } = require("./utils/scheduleUtils.js");
const { MainDatabase: db } = require("./utils/database.js");
const { getRole } = require("./utils/getRole.js");

// New TMI Client
// ! Make sure you have populate process.env at the root of the project
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
    channels: [process.env.channel]
});

// Map Commands
client.commands = new Map();
client.connect();

// Once connected
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
            // Slice messages from the tchat and return an Array like ["This", "Is", "A", "Message"]
            const args = message.slice(prefix.length).trim().split(/ +/g);
            // Check if there are a txt command register in db
            const isTxt = await db.has(`txt.${args[0]}`);

            if (isTxt)
            {
                const getTxt = await db.get(`txt.${args[0]}`)
                return client.say(channel, getTxt);
            }

            // Check if command exist
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