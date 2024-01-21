const { QuickDB } = require("quick.db");

class MainDatabase extends QuickDB
{
    constructor()
    {
        super({ filePath: `${process.cwd()}/../db/database.sqlite`});
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
    MainDatabase: new MainDatabase()
};