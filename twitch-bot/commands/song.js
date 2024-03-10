const axios = require("axios");
const { MainDatabase: db } = require("../utils/database.js");

module.exports =
{
    run: async (client, channel, tags, message, self, args) =>
    {
        const selection = args[0];
        const baseUrl = "https://widget.nowplaying.site";
        const widgetSongToken = process.env.widgetSongToken;
        switch (selection)
        {
            case "previous":
                const previous = await axios.get(`${baseUrl}/previous/${widgetSongToken}`);
                client.say(channel, `🎵 ► ${previous.data}`);
            break;

            case "current":
                const current = await axios.get(`${baseUrl}/current/${widgetSongToken}`);
                client.say(channel, `🎵 ► ${current.data}`);
            break;
            default:
                const prefix = await db.getPrefix();
                client.say(channel, `► ${prefix}song current | ${prefix}song previous`);
            break;
        }
    },
    name: "song",
    permission: ["broadcaster", "moderator", "viewer", "vip"]
}