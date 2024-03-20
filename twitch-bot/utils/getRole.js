// User roles
const USER_ROLES = { VIEWER: "viewer", VIP: "vip", MODERATOR: "moderator", BROADCASTER: "broadcaster" };

function getRole(user, channel)
{
    const formattedChannel = channel.replace('#', '');
    if (user.username === formattedChannel) return USER_ROLES.BROADCASTER;
    if (user.mod) return USER_ROLES.MODERATOR;
    if (user.badges.vip) return USER_ROLES.VIP;

    return USER_ROLES.VIEWER;
}

module.exports = {
    getRole: getRole
}