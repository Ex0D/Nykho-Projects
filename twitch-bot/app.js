require('dotenv').config({ path: '../.env' });
const tmi = require('tmi.js');
const Collection = require('./utils/collection.js');

const client = new tmi.Client({
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
        maxReconnectAttempts: 3,
        reconnectInterval: 15
    },
    identity: {
        username: "nykhobot",
        password: process.env.twitchBotToken
    },
    channels: ["ex_ode"]
});

client.commands = new Collection();

module.exports = client;

require('./utils/handler.js')(client);


client.connect();