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
                    return client.say(channel, "Aucun argument passé pour le nom du schedule");
                }

                const searchScheduleName = await db.has(`schedule.${scheduleName}`);
                if (searchScheduleName)
                {
                    return client.say(channel, `${scheduleName} existe déjà !`);
                }

                const timeOrActivity = args[2];

                if (!timeOrActivity)
                {
                    return client.say(channel, `Il manque des paramètres pour pouvoir compléter cette commande !`);
                }

                if (timeOrActivity === "time")
                {
                    const cronSliced = args.slice(3, 8);

                    if (!cronSliced)
                    {
                        return client.say(channel, `Expression cron non valide ! (Il manque des paramètres de temps)`);
                    }

                    const addCronString = cronSliced.join(" ");

                    if (!cron.validate(addCronString))
                    {
                        return client.say(channel, `Expression cron non valide ! (Format cron incorrect)`);
                    }

                    const stringSpliced = args.splice(8).join(" ");

                    if (!stringSpliced)
                    {
                        return client.say(channel, `Il manque le texte à sauvegarder !`);
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

                    return client.say(channel, `Création de la tâche ${scheduleName} faite !`);
                }
                else if (timeOrActivity === "activity")
                {
                    const numberMessages = args[3];

                    if (!numberMessages)
                    {
                        return client.say(channel, "Il manque le nombre de messages !");
                    }

                    const stringSpliced = args.splice(4).join(" ");

                    if (!stringSpliced)
                    {
                        return client.say(channel, "Il manque le texte à sauvegarder");
                    }

                    await db.set(`schedule.${scheduleName}.activity`, 0);
                    await db.add(`schedule.${scheduleName}.numberOfMessages`, numberMessages);
                    await db.set(`schedule.${scheduleName}.activityText`, stringSpliced);

                    return client.say(channel, `Création de la tâche ${scheduleName} faite !`);
                }
            break;

            case "delete":
            case "del":
                const scheduleToDelete = args[1];

                if (!scheduleToDelete)
                {
                    return client.say(channel, `Aucun paramètre passé pour la supression d'une tâche !`);
                }

                const searchScheduleNameToDel = await db.has(`schedule.${scheduleToDelete}`);

                if (!searchScheduleNameToDel)
                {
                    return client.say(channel, `La tâche ${scheduleToDelete} n'existe pas !`);
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
                            return client.say(channel, `${scheduleToDelete} n'a pas pu être supprimé (pas trouvé dans la liste des tâches)`)
                        }
                    }

                    client.say(channel, `${scheduleToDelete} a bien été supprimé`)
                }
                else
                {
                    await db.delete(`schedule.${scheduleToDelete}`);
                    return client.say(channel, `La tâche ${scheduleToDelete} a bien été supprimé !`);
                }

            break;

            case "edit":
                const scheduleToEdit = args[1];

                if (!scheduleToEdit)
                {
                    return client.say(channel, `Aucun paramètre passé pour éditer la tâche !`);
                }

                const searchScheduleToEdit = await db.has(`schedule.${scheduleToEdit}`);

                if (!searchScheduleToEdit)
                {
                    return client.say(channel, `${scheduleToEdit} n'existe pas !`)
                }

                const isTimer = await db.has(`schedule.${scheduleToEdit}.time`);

                if (isTimer)
                {
                    const editCron = args.slice(2, 7);

                    if (!editCron)
                    {
                        return client.say(channel, "Expression cron non valide ! (Il manque des paramètres de temps)");
                    }

                    const editCronString = editCron.join(" ");

                    if (!cron.validate(editCronString))
                    {
                        return client.say(channel, `Expression cron non valide ! (Format cron incorrect)`);
                    }

                    const editMsgSpliced = args.splice(7).join(" ");

                    if (!editMsgSpliced)
                    {
                        return client.say(channel, "Il manque le texte à sauvegarder !");
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

                    return client.say(channel, `La tâche ${scheduleToEdit} a bien été édité !`);
                }
                else
                {
                    const editNumberMessages = args[2];

                    if (!editNumberMessages)
                    {
                        return client.say(channel, "Il manque le nombre de messages");
                    }

                    const editStringSpliced = args.splice(3).join(" ");

                    if (!editStringSpliced)
                    {
                        return client.say(channel, "Il manque le texte à sauvegarder !");
                    }

                    await db.set(`schedule.${scheduleToEdit}.activity`, 0);
                    await db.set(`schedule.${scheduleToEdit}.numberOfMessages`, parseInt(editNumberMessages));
                    await db.set(`schedule.${scheduleToEdit}.activityText`, editStringSpliced);

                    return client.say(channel, `La tâche ${scheduleToEdit} a bien été édité !`);
                }

            break;

            case "list":
                const listSchedule = await db.get(`schedule`);
                const strSchedule = Object.keys(listSchedule).reverse().join(" | ");

                client.say(channel, `Liste des tâches actives : ${strSchedule}`);
            break;

            default:
                client.say(channel, "Mauvaise utilisation de la commande schedule");
            break;
        }
    },
    name: "schedule",
    permission: ["moderator", "broadcaster"]
}