const { MainDatabase: db } = require("./database.js");
const cron = require("node-cron");

async function checkMessagesActivity(client)
{
    const allSchedule = await db.get(`schedule`);
    if (!allSchedule) return;

    for (i in allSchedule)
    {
        if (allSchedule[i].activity >= allSchedule[i].numberOfMessages)
        {
            await db.set(`schedule.${i}.activity`, 0);
            return client.say(client.getChannels()[0], allSchedule[i].activityText);
        }
        else
        {
            await db.add(`schedule.${i}.activity`, 1);
        };
    };
};

async function loadSchedule(client)
{
    const allSchedule = await db.get(`schedule`);
    if (!allSchedule) return;

    for (i in allSchedule)
    {
        if (allSchedule[i].time)
        {
            cron.schedule(allSchedule[i].time, () =>
            {
                client.say(client.getChannels()[0], allSchedule[i].text)
            },
            {
                name: `${allSchedule[i].name}`
            });
        }
    }
}

module.exports =
{
    checkMessagesActivity: checkMessagesActivity,
    loadSchedule: loadSchedule
}