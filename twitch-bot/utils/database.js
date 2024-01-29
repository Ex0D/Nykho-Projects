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
}

module.exports = {
    // * Instance of new database who extends Quick.db
    // * Can now populate methods from this classes + quick.db
    MainDatabase: new MainDatabase()
};