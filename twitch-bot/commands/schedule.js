const { MainDatabase: db } = require("../utils/database.js");
const cron = require("node-cron");

module.exports = {
    run: async (client, channel, tags, message, self, args) =>
    {
        switch (args[0])
        {
            case "add":
                const scheduleName = args[1];

                if (!scheduleName)
                {
                    return client.say(channel, "No argument passed for the schedule name");
                }

                const searchScheduleName = await db.has(`schedule.${scheduleName}`);
                if (searchScheduleName)
                {
                    return client.say(channel, `${scheduleName} already exists !`);
                }

                const timeOrActivity = args[2];

                if (!timeOrActivity)
                {
                    return client.say(channel, `Some parameters are missing to complete this command !`);
                }

                if (timeOrActivity === "time")
                {
                    const cronSliced = args.slice(3, 8);

                    if (!cronSliced)
                    {
                        return client.say(channel, `Invalid cron expression ! (Time parameters missing)`);
                    }

                    const addCronString = cronSliced.join(" ");

                    if (!cron.validate(addCronString))
                    {
                        return client.say(channel, `Invalid cron expression ! (Incorrect cron format)`);
                    }

                    const stringSpliced = args.splice(8).join(" ");

                    if (!stringSpliced)
                    {
                        return client.say(channel, `The text to be saved is missing!`);
                    }

                    await db.set(`schedule.${scheduleName}.time`, addCronString);
                    await db.set(`schedule.${scheduleName}.text`, stringSpliced);
                    await db.set(`schedule.${scheduleName}.name`, scheduleName);

                    cron.schedule(addCronString, () => {
                        client.say(channel, stringSpliced);
                    },
                    {
                        name: scheduleName
                    });

                    return client.say(channel, `Task ${scheduleName} created !`);
                }
                else if (timeOrActivity === "activity")
                {
                    const numberMessages = args[3];

                    if (!numberMessages)
                    {
                        return client.say(channel, "The number of messages is missing !");
                    }

                    const stringSpliced = args.splice(4).join(" ");

                    if (!stringSpliced)
                    {
                        return client.say(channel, "The text to be saved is missing !");
                    }

                    await db.set(`schedule.${scheduleName}.activity`, 0);
                    await db.add(`schedule.${scheduleName}.numberOfMessages`, numberMessages);
                    await db.set(`schedule.${scheduleName}.activityText`, stringSpliced);

                    return client.say(channel, `Task ${scheduleName} created !`);
                }
            break;

            case "delete":
            case "del":
            case "remove":
            case "rm":
                const scheduleToDelete = args[1];

                if (!scheduleToDelete)
                {
                    return client.say(channel, `No parameters passed to delete the task !`);
                }

                const searchScheduleNameToDel = await db.has(`schedule.${scheduleToDelete}`);

                if (!searchScheduleNameToDel)
                {
                    return client.say(channel, `Task ${scheduleToDelete} does not exist!`);
                }

                const timeN = await db.get(`schedule.${scheduleToDelete}.time`)
                if (timeN)
                {
                    const tasks = cron.getTasks();

                    for (let [key] of tasks.entries())
                    {
                        if (key.includes(scheduleToDelete))
                        {
                            tasks.get(scheduleToDelete).stop();
                            await db.delete(`schedule.${scheduleToDelete}`);
                        }
                        else
                        {
                            return client.say(channel, `${scheduleToDelete} could not be deleted (not found in task list) !`)
                        }
                    }

                    client.say(channel, `${scheduleToDelete} has been deleted !`)
                }
                else
                {
                    await db.delete(`schedule.${scheduleToDelete}`);
                    return client.say(channel, `The task ${scheduleToDelete} has been deleted !`);
                }

            break;

            case "edit":
            case "modify":
                const scheduleToEdit = args[1];

                if (!scheduleToEdit)
                {
                    return client.say(channel, `No parameters passed to edit the task !`);
                }

                const searchScheduleToEdit = await db.has(`schedule.${scheduleToEdit}`);

                if (!searchScheduleToEdit)
                {
                    return client.say(channel, `${scheduleToEdit} does not exist !`)
                }

                const isTimer = await db.has(`schedule.${scheduleToEdit}.time`);

                if (isTimer)
                {
                    const editCron = args.slice(2, 7);

                    if (!editCron)
                    {
                        return client.say(channel, "Invalid cron expression ! (Time parameters missing)");
                    }

                    const editCronString = editCron.join(" ");

                    if (!cron.validate(editCronString))
                    {
                        return client.say(channel, `Invalid cron expression ! (Incorrect cron format)`);
                    }

                    const editMsgSpliced = args.splice(7).join(" ");

                    if (!editMsgSpliced)
                    {
                        return client.say(channel, "The text to be saved is missing !");
                    }

                    const tasks = cron.getTasks();

                    for (let [key] of tasks.entries())
                    {
                        if (key.includes(scheduleToEdit))
                        {
                            tasks.get(scheduleToEdit).stop();
                        }
                    }

                    await db.set(`schedule.${scheduleToEdit}.time`, editCronString);
                    await db.set(`schedule.${scheduleToEdit}.text`, editMsgSpliced);

                    cron.schedule(editCronString, () =>
                    {
                        client.say(channel, editMsgSpliced);
                    },
                    {
                        name: scheduleToEdit
                    });

                    return client.say(channel, `The task ${scheduleToEdit} has been edited !`);
                }
                else
                {
                    const editNumberMessages = args[2];

                    if (!editNumberMessages)
                    {
                        return client.say(channel, "The number of messages is missing !");
                    }

                    const editStringSpliced = args.splice(3).join(" ");

                    if (!editStringSpliced)
                    {
                        return client.say(channel, "The text to be saved is missing !");
                    }

                    await db.set(`schedule.${scheduleToEdit}.activity`, 0);
                    await db.set(`schedule.${scheduleToEdit}.numberOfMessages`, parseInt(editNumberMessages));
                    await db.set(`schedule.${scheduleToEdit}.activityText`, editStringSpliced);

                    client.say(channel, `The task ${scheduleToEdit} has been edited !`);
                }

            break;

            case "list":
            case "ls":
                const listSchedule = await db.get(`schedule`);
                const strSchedule = Object.keys(listSchedule).reverse().join(" | ");

                client.say(channel, `List of active tasks ► ${strSchedule}`);
            break;

            default:
                client.say(channel, "Incorrect use of the schedule command");
            break;
        }
    },
    name: "schedule",
    permission: ["moderator", "broadcaster"]
}