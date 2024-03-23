const { QuickDB } = require("quick.db");

class MainDatabase extends QuickDB
{
    constructor()
    {
        // Database link
        // * ${__dirname} is used for better debbuging because ${process.cwd()} return an error
        super({ filePath: `${__dirname}/../../db/database.sqlite`});
    }

    async getPrefix()
    {
        const prefix = await this.get("config.prefix");
        if (!prefix)
        {
            return await this.set("config.prefix", "+");
        }

        return prefix;
    }

    async setPrefix(prefix)
    {
        return await this.set("config.prefix", prefix);
    }

    async getTxtTimeout()
    {
        const txtTimeout = await this.get("config.txtTimeout");
        if (!txtTimeout)
        {
            return await this.set("config.txtTimeout", 3);
        }

        return txtTimeout;
    }

    async setTxtTimeout(num)
    {
        return await this.set("config.txtTimeout", parseInt(num));
    }

    async getCmdTimeout()
    {
        const cmdTimeout = await this.get("config.cmdTimeout");
        if (!cmdTimeout)
        {
            return await this.set("config.cmdTimeout", 3);
        }

        return cmdTimeout;
    }

    async setCmdTimeout(num)
    {
        return await this.set("config.cmdTimeout", parseInt(num))
    }
}

module.exports = {
    // * Instance of new database who extends Quick.db
    // * Can now populate methods from this classes + quick.db
    MainDatabase: new MainDatabase()
};