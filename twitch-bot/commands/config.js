const { MainDatabase: db } = require("../utils/database.js");

module.exports =
{
    run: async (client, channel, tags, message, self, args) =>
    {
        const opt = args[0]

        if (!opt)
        {
            return client.say(channel, "Option is missing !")
        }

        switch (opt)
        {
            case "prefix":
                const prefix = args[1];

                if (!prefix)
                {
                    return client.say(channel, "Prefix is missing !");
                }

                const prefixInDb = await db.getPrefix();

                if (prefix === prefixInDb)
                {
                    return client.say(channel, `${prefix} is already the prefix in use !`);
                }
                else
                {
                    await db.setPrefix(prefix);
                    client.say(channel, `${prefix} is now the new prefix for the bot !`);
                }
            break;

            case "timeout":
                const timeoutType = args[1];

                if (!timeoutType)
                {
                    return client.say(channel, "Type of timeout is missing !");
                }

                switch (timeoutType)
                {
                    case "cmd":
                    case "command":
                    case "commands":
                        const cmdTimeout = args[2];

                        if (!cmdTimeout)
                        {
                            return client.say("Timeout is missing !");
                        }

                        if (allTimeout < 0)
                        {
                            return client.say("Timeout must be positive !");
                        }

                        await db.setCmdTimeout(cmdTimeout);

                        client.say(`Commands now have ${cmdTimeout} second(s) of timeout  !`);
                    break;

                    case "txt":
                    case "text":
                        const txtTimeout = args[2];

                        if (!txtTimeout)
                        {
                            return client.say("Timeout is missing !");
                        }

                        if (allTimeout < 0)
                        {
                            return client.say("Timeout must be positive !");
                        }

                        await db.setTxtTimeout(txtTimeout);

                        client.say(`Text commands now have ${txtTimeout} second(s) of timeout !`);
                    break;
                }
            break;

            case "all":
                const allTimeout = args[2];

                if (!allTimeout)
                {
                    return client.say("Timeout is missing !");
                }

                if (allTimeout < 0)
                {
                    return client.say("Timeout must be positive !");
                }

                await db.setCmdTimeout(allTimeout);
                await db.setTxtTimeout(allTimeout);

                client.say(`Text and Commands now have ${allTimeout} second(s) of timeout !`)
            break;

            default:
                client.say(channel, "Incorrect use of the config command !");
            break;
        }
    },
    name: "config",
    permission: ["broadcaster"]
}